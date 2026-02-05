import {Text, TextStyle, TouchableOpacity, type TouchableOpacityProps} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import {ReactNode} from "react";
import {clsx} from "clsx";

type Props = TouchableOpacityProps & {
    children?: string
    active?: boolean
    icon?: ReactNode
    textClassName?: string
    textStyle?: TextStyle
}

export function Button({ children, className, active, icon, textClassName, textStyle, ...rest }: Props) {
    const {isDark, colors} = useThemeColor()

    return <TouchableOpacity
        style={[{backgroundColor: active ? colors.primary : colors.box}]}
        className={clsx(`border flex ${icon && "flex-row gap-2 items-center justify-center"} ${isDark ? "border-slate-800" : "border-slate-200"} text-center rounded-2xl h-12 items-center justify-center self-center px-5`, className)}
        {...rest}
        activeOpacity={.8}
    >
        {icon}
        {children && <Text
            className={clsx(`text-base font-medium text-center ${active && !isDark && "!text-white"} ${icon && "relative -top-[1px]"}`, textClassName)}
            style={[textStyle, { color: colors.textPrimary }]}>
            {children}
        </Text>}
    </TouchableOpacity>
}
