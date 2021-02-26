import { findNodeHandle, requireNativeComponent, UIManager } from 'react-native';
import React from 'react';
const NATIVE_NAME = 'SignatureBoardView';
const NativeSignatureBoard = requireNativeComponent(NATIVE_NAME);

const colorHelper = color => {
  if (color.startsWith('#')) {
    if (color.length === 7) return color;else if (color.length === 4) {
      const r = color[1] + '';
      const g = color[2] + '';
      const b = color[3] + '';
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return '#ffffff';
  }

  return '#ffffff';
};

const UIManagerSendMsg = (nativeRef, name, args = []) => {
  if (!nativeRef) return;
  const id = findNodeHandle(nativeRef.current);
  const command = UIManager.getViewManagerConfig(NATIVE_NAME).Commands[name];
  UIManager.dispatchViewManagerCommand(id, command, args);
};

export const SignatureBoard = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    style,
    bgColor,
    lineColor,
    lineWidth,
    onImageFinish
  } = props;
  const nativeRef = React.useRef(null);
  React.useImperativeHandle(ref, () => ({
    clear: () => UIManagerSendMsg(nativeRef, 'clear'),
    getImage: (opaque = true) => UIManagerSendMsg(nativeRef, 'getImage', [opaque])
  }));
  const handleImageFinish = React.useCallback(result => {
    if (onImageFinish) onImageFinish(`data:image/png;base64,${result.nativeEvent.res}`);
  }, [onImageFinish]);
  return /*#__PURE__*/React.createElement(NativeSignatureBoard, {
    onImageFinish: handleImageFinish,
    ref: nativeRef,
    style: style,
    bgColor: colorHelper(bgColor || '#FFF'),
    lineColor: colorHelper(lineColor || '#000'),
    lineWidth: lineWidth
  });
});
export default SignatureBoard;
//# sourceMappingURL=index.js.map