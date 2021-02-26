package com.signatureboard

import android.util.Log
import android.view.View
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class SignatureBoardViewManager : SimpleViewManager<View>() {
  private val NAME_CLASS = "SignatureBoardView"
  private val METHOD_CLEAR = 0
  private val METHOD_GET_IMAGE = 1
  override fun getName(): String {
    return NAME_CLASS
  }

  override fun createViewInstance(reactContext: ThemedReactContext): SignatureBoardView {
    return SignatureBoardView(reactContext)
  }

  // 定义 onChange 之类的方法
  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any?>? {
    return MapBuilder.of<String, Any?>(
      "SignatureBoardImageFinish",
      MapBuilder.of(
        "phasedRegistrationNames",
        MapBuilder.of("bubbled", "onImageFinish")
      )
    )
  }

  // 定义 给 JS 用的方法 - 直接调用
  override fun getCommandsMap(): Map<String, Int>? {
    return MapBuilder.of(
      "clear", METHOD_CLEAR,
      "getImage", METHOD_GET_IMAGE
    )
  }

  override fun receiveCommand(root: View, commandId: Int, args: ReadableArray?) {
    Log.d("receiveCommand", "receiveCommand: $args")

    root as SignatureBoardView
    when (commandId) {
      METHOD_CLEAR -> {
        root.clear()
      }
      METHOD_GET_IMAGE -> {
        val argsArr = args?.toArrayList()
        root.getImage(argsArr?.get(0) as Boolean)
      }
    }
  }

  @ReactProp(name = "bgColor")
  fun setBgColor(view: SignatureBoardView, bgColor: String?) {
    if (bgColor != null) {
      view.setBgColor(bgColor)
    }
  }

  @ReactProp(name = "lineColor")
  fun setLineColor(view: SignatureBoardView, lineColor: String?) {
    if (lineColor != null) {
      view.setLineColor(lineColor)
    }
  }

  @ReactProp(name = "lineWidth", defaultInt = 1)
  fun setLineWidth(view: SignatureBoardView, lineWidth: Int) {
    view.setLineWidth(lineWidth)
  }
}
