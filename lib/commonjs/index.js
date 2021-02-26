"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SignatureBoard = void 0;

var _reactNative = require("react-native");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NATIVE_NAME = 'SignatureBoardView';
const NativeSignatureBoard = (0, _reactNative.requireNativeComponent)(NATIVE_NAME);

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
  const id = (0, _reactNative.findNodeHandle)(nativeRef.current);

  const command = _reactNative.UIManager.getViewManagerConfig(NATIVE_NAME).Commands[name];

  _reactNative.UIManager.dispatchViewManagerCommand(id, command, args);
};

const SignatureBoard = /*#__PURE__*/_react.default.forwardRef((props, ref) => {
  const {
    style,
    bgColor,
    lineColor,
    lineWidth,
    onImageFinish
  } = props;

  const nativeRef = _react.default.useRef(null);

  _react.default.useImperativeHandle(ref, () => ({
    clear: () => UIManagerSendMsg(nativeRef, 'clear'),
    getImage: (opaque = true) => UIManagerSendMsg(nativeRef, 'getImage', [opaque])
  }));

  const handleImageFinish = _react.default.useCallback(result => {
    if (onImageFinish) onImageFinish(`data:image/png;base64,${result.nativeEvent.res}`);
  }, [onImageFinish]);

  return /*#__PURE__*/_react.default.createElement(NativeSignatureBoard, {
    onImageFinish: handleImageFinish,
    ref: nativeRef,
    style: style,
    bgColor: colorHelper(bgColor || '#FFF'),
    lineColor: colorHelper(lineColor || '#000'),
    lineWidth: lineWidth
  });
});

exports.SignatureBoard = SignatureBoard;
var _default = SignatureBoard;
exports.default = _default;
//# sourceMappingURL=index.js.map