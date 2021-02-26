package com.signatureboard

import android.content.Context
import android.graphics.*
import android.util.Base64
import android.util.Log
import android.view.MotionEvent
import android.view.SurfaceHolder
import android.view.SurfaceView
import java.io.ByteArrayOutputStream

/**
 * Create By songhang in 2/26/21
 */
internal class SignatureBoardSurfaceView(context: Context?, lineWidth: Int, bgColor: String, lineColor: String) : SurfaceView(context), SurfaceHolder.Callback {
  // 定义每一个 动作的内部类
  internal inner class Action(color: String?, size: Int) {
    val paint: Paint = Paint()
    val path: Path

    fun startPoint(p: Point) {
      path.moveTo(p.x.toFloat(), p.y.toFloat())
    }

    fun movePoint(p: Point) {
      path.lineTo(p.x.toFloat(), p.y.toFloat())
    }

    init {
      paint.isAntiAlias = true
      paint.isDither = true
      paint.alpha = 255
      paint.style = Paint.Style.STROKE
      paint.strokeCap = Paint.Cap.ROUND
      paint.strokeJoin = Paint.Join.ROUND
      paint.color = Color.parseColor(color)
      paint.strokeWidth = size.toFloat()
      path = Path()
    }
  }

  internal interface SignatureBoardSurfaceViewHandler {
    fun imageFinish(str: String?)
  }

  private var mSurfaceHolder: SurfaceHolder? = null
  private var lineWidth: Int
  private var bgColor: String
  private var lineColor: String
  private var nowAction: Action? = null
  private val actions: ArrayList<Action>
  private var hasChange = true // 每次对应属性变化，才去创建新的 action
  private var isRunning //线程的控制开关
    = false
  private var handler: SignatureBoardSurfaceViewHandler? = null

  //#region SurfaceHolder.Callback
  override fun surfaceCreated(holder: SurfaceHolder?) {
    isRunning = true
    //用于绘制的线程
    val thread = Thread(Runnable {
      val start = System.currentTimeMillis()
      while (isRunning) drawCanvas()
      val end = System.currentTimeMillis()
      if (end - start < 100) {
        try {
          Thread.sleep(100 - end + start)
        } catch (e: InterruptedException) {
          e.printStackTrace()
        }
      }
    })
    thread.start()
  }

  override fun surfaceChanged(holder: SurfaceHolder?, format: Int, width: Int, height: Int) {}
  override fun surfaceDestroyed(holder: SurfaceHolder?) {
    isRunning = false
  }

  //#endregion
  //#region draw
  override fun onTouchEvent(event: MotionEvent): Boolean {
    val action = event.action
    if (action == MotionEvent.ACTION_CANCEL) return false
    val point = Point(event.x.toInt(), event.y.toInt())
    when (action) {
      MotionEvent.ACTION_DOWN -> {
        createAction()
        nowAction!!.startPoint(point)
      }
      MotionEvent.ACTION_MOVE -> nowAction!!.movePoint(point)
      else -> {
      }
    }
    return true
  }

  private fun drawCanvas() {
    val canvas = mSurfaceHolder!!.lockCanvas()
    try {
      canvas?.let { drawPath(it) }
    } catch (e: Exception) {
      e.printStackTrace()
    } finally {
      if (canvas != null) mSurfaceHolder!!.unlockCanvasAndPost(canvas)
    }
  }

  fun drawPath(canvas: Canvas,opaque:Boolean = true) {
    if(opaque) canvas.drawColor(Color.parseColor(bgColor))
    else canvas.drawColor(Color.TRANSPARENT,PorterDuff.Mode.OVERLAY)
    for (action in actions) {
      canvas.drawPath(action.path, action.paint)
    }
  }

  fun clear() {
    actions.clear()
    hasChange = true
    createAction()
  }

  fun getImage(opaque:Boolean = true) {
    val thread = Thread(Runnable {
      val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
      val canvas = Canvas(bitmap)
      drawPath(canvas,opaque)
      val byteArrayOutputStream = ByteArrayOutputStream()
      bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
      val byteArray = byteArrayOutputStream.toByteArray()
      val encoded = Base64.encodeToString(byteArray, Base64.DEFAULT)
      if (handler != null) handler!!.imageFinish(encoded)
    })
    thread.start()
  }

  //#endregion
  //#region get / set
  private fun createAction() {
    if (hasChange) {
      val action = Action(lineColor, lineWidth)
      nowAction = action
      actions.add(action)
    }
    hasChange = false
  }

  fun setLineWidth(lineWidth: Int) {
    this.lineWidth = lineWidth
    hasChange = true
  }

  fun setBgColor(bgColor: String) {
    this.bgColor = bgColor
  }

  fun setLineColor(lineColor: String) {
    this.lineColor = lineColor
    hasChange = true
  }

  fun setHandler(handler: SignatureBoardSurfaceViewHandler?) {
    this.handler = handler
  } //#endregion

  init {
//    setZOrderOnTop(true)
//    this.holder.setFormat(PixelFormat.TRANSLUCENT)
    isFocusable = true
    // 基本属性
    this.lineWidth = lineWidth
    this.bgColor = bgColor
    this.lineColor = lineColor
    // SurfaceHolder
    mSurfaceHolder = this.holder
    mSurfaceHolder?.addCallback(this)
    // action
    actions = ArrayList()
    createAction()
  }
}
