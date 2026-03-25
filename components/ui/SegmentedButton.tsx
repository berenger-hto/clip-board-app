import { useThemeColor } from "@/hooks/useThemeColor"
import { TouchableOpacity, Text as NativeText, type TouchableOpacityProps } from "react-native"

type SegmentedButtonProps = TouchableOpacityProps & {
    active?: boolean
    title: string
}

export function SegmentedButton( { active, title, ...rest }: SegmentedButtonProps ) {
    const { isDark, colors } = useThemeColor()
    return <TouchableOpacity
        style={{ backgroundColor: active ? colors.box : "transparent" }}
        className="p-2 rounded-lg flex-1"
        activeOpacity={.7}
        {...rest}
    >
        <NativeText
            style={{ color: active ? colors.primary : colors.textPrimary }}
            className={`text-sm font-bold text-center ${active ? 'opacity-100' : 'opacity-70'}`}
            numberOfLines={1}
        >
            {title}
        </NativeText>
    </TouchableOpacity>
}