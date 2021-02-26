import { findNodeHandle, requireNativeComponent, UIManager, ViewStyle } from 'react-native'
import React from 'react'
interface NativeSignatureBoardBase {
  style?: ViewStyle
  bgColor?: string
  lineColor?: string
  lineWidth?: number
}
interface NativeSignatureBoardProps extends NativeSignatureBoardBase {
  onImageFinish?: (res: any) => void
}
export interface SignatureBoardProps extends NativeSignatureBoardBase {
  onImageFinish?: (res: string) => void
}
export interface SignatureRef {
  clear: () => void
  getImage: (opaque: boolean) => void
}
const NATIVE_NAME = 'SignatureBoardView'
const NativeSignatureBoard = requireNativeComponent<NativeSignatureBoardProps>(NATIVE_NAME)
const colorHelper = (color: string): string => {
  if (color.startsWith('#')) {
    if (color.length === 7) return color
    else if (color.length === 4) {
      const r = color[1] + ''
      const g = color[2] + ''
      const b = color[3] + ''
      return `#${r}${r}${g}${g}${b}${b}`
    }
    return '#ffffff'
  }
  return '#ffffff'
}
const UIManagerSendMsg = (nativeRef: React.MutableRefObject<any>, name: string, args: any[] = []) => {
  if (!nativeRef) return
  const id = findNodeHandle(nativeRef.current)
  const command = UIManager.getViewManagerConfig(NATIVE_NAME).Commands[name]
  UIManager.dispatchViewManagerCommand(id, command, args)
}
export const SignatureBoard = React.forwardRef<SignatureRef, SignatureBoardProps>((props, ref) => {
  const { style, bgColor, lineColor, lineWidth, onImageFinish } = props
  const nativeRef = React.useRef(null)
  React.useImperativeHandle(ref, () => ({
    clear: (): void => UIManagerSendMsg(nativeRef, 'clear'),
    getImage: (opaque: boolean = true): void => UIManagerSendMsg(nativeRef, 'getImage', [opaque]),
  }))
  const handleImageFinish = React.useCallback((result) => {
    if (onImageFinish) onImageFinish(`data:image/png;base64,${result.nativeEvent.res}`)
  }, [onImageFinish])
  return (
    <NativeSignatureBoard
      onImageFinish={handleImageFinish}
      ref={nativeRef}
      style={style}
      bgColor={colorHelper(bgColor || '#FFF')}
      lineColor={colorHelper(lineColor || '#000')}
      lineWidth={lineWidth}
    />
  )
})
export default SignatureBoard
