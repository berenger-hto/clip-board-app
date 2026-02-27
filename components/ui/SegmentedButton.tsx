import { useThemeColor } from "@/hooks/useThemeColor"
import { TouchableOpacity, Text as NativeText, type TouchableOpacityProps } from "react-native"

type SegmentedButtonProps = TouchableOpacityProps & {
    active?: boolean
    title: string
}

export function SegmentedButton( { active, title, ...rest }: SegmentedButtonProps ) {
    const { isDark, colors } = useThemeColor()
    return <TouchableOpacity
        style={{ backgroundColor: (active && isDark) ? "#1a1425" : (!isDark && active) ? "#fff" : "transparent" }}
        className="p-2 rounded-lg flex-1"
        activeOpacity={.7}
        {...rest}
    >
        <NativeText
            style={{ color: (active && isDark) ? "#fff" : (!isDark && active) ? colors.primary : colors.textPrimary }}
            className="opacity-70 text-sm font-bold text-center"
            numberOfLines={1}
        >
            {title}
        </NativeText>
    </TouchableOpacity>
}