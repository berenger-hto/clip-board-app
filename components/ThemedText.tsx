import {Text, type TextProps} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";

type Props = TextProps

export function ThemedText({ style, ...rest }: Props) {
    const { colors } = useThemeColor()
    return <Text style={[{ color: colors.textPrimary }, style]} {...rest} />

}