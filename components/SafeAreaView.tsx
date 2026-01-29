import {SafeAreaView as NativeSafeAreaView, SafeAreaViewProps} from "react-native-safe-area-context";
import {useThemeColor} from "@/hooks/useThemeColor";

export function SafeAreaView({ style, ...rest }: SafeAreaViewProps) {
    const { colors } = useThemeColor()
    return <NativeSafeAreaView style={[{ backgroundColor: colors.background }, style]} {...rest} />
}