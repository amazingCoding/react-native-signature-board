import { requireNativeComponent, ViewStyle } from 'react-native';

type SignatureBoardProps = {
  color: string;
  style: ViewStyle;
};


export const SignatureBoardViewManager = requireNativeComponent<SignatureBoardProps>(
  'SignatureBoardView'
);

export default SignatureBoardViewManager;
