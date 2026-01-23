import {StyleProp, Text, TextProps, TextStyle} from "react-native";
import {useTheme} from "@/hooks/useTheme";
import {TextSIze, TextSizeLevel} from "@/constants/TextSIze";

type Props = TextProps & {
    style?: StyleProp<TextStyle>
    size?: TextSizeLevel
    opacity?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
}

export function ThemedText({ style, size = "normal", opacity = 100, ...rest }: Props) {
    const theme = useTheme()
    return <Text
        style={[{ color: theme.textPrimary, fontSize: TextSIze[size], opacity: (opacity / 100)}, style]}
        {...rest}
    />
}