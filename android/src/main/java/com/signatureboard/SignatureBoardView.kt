package com.signatureboard

import android.content.Context
import android.widget.LinearLayout
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter

/**
 * Create By songhang in 2/26/21
 */
class SignatureBoardView(context: Context?) : LinearLayout(context), SignatureBoardSurfaceView.SignatureBoardSurfaceViewHandler {
  private val view: SignatureBoardSurfaceView?
  private var lineWidth = 1
  private var bgColor = "#FFFFFF"
  private var lineColor = "#000000"
  fun setLineWidth(lineWidth: Int) {
    this.lineWidth = lineWidth
    view?.setLineWidth(lineWidth)
  }

  fun setBgColor(bgColor: String) {
    this.bgColor = bgColor
    view?.setBgColor(bgColor)
  }

  fun setLineColor(lineColor: String) {
    this.lineColor = lineColor
    view?.setLineColor(lineColor)
  }

  fun clear() {
    view?.clear()
  }

  fun getImage(opaque:Boolean = true) {
    view?.getImage(opaque)
  }

  override fun imageFinish(str: String?) {
    val event = Arguments.createMap()
    event.putString("res", str)
    val reactContext = context as ReactContext
    reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(id, "SignatureBoardImageFinish", event)
  }

  init {
    view = SignatureBoardSurfaceView(context, lineWidth, bgColor, lineColor)
    val layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    this.addView(view, layoutParams)
    view.setHandler(this)
  }
}
