import { ViewStyle } from 'react-native';
import React from 'react';
interface NativeSignatureBoardBase {
    style?: ViewStyle;
    bgColor?: string;
    lineColor?: string;
    lineWidth?: number;
}
export interface SignatureBoardProps extends NativeSignatureBoardBase {
    onImageFinish?: (res: string) => void;
}
export interface SignatureRef {
    clear: () => void;
    getImage: (opaque: boolean) => void;
}
export declare const SignatureBoard: React.ForwardRefExoticComponent<SignatureBoardProps & React.RefAttributes<SignatureRef>>;
export default SignatureBoard;
