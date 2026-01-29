import {View as NativeView, ViewProps} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";

export function View({ style, ...rest }: ViewProps) {
    const { colors } = useThemeColor()
    return <NativeView style={[{ backgroundColor: colors.background }, style]} {...rest} />
}