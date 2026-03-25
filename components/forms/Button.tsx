import { Text, TextStyle, TouchableOpacity, type TouchableOpacityProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ReactNode } from "react";
import { clsx } from "clsx";

type Props = TouchableOpacityProps & {
    children?: string
    active?: boolean
    icon?: ReactNode
    textClassName?: string
    textStyle?: TextStyle
}

export function Button({ children, className, active, icon, textClassName, textStyle, style, ...rest }: Props) {
    const { colors } = useThemeColor()

    return <TouchableOpacity
        style={[style, {
            backgroundColor: active ? colors.primary : colors.box,
            borderColor: rest.disabled ? "transparent" : active ? colors.primary : colors.borderNavColor
        }, {
                opacity: rest.disabled ? .5 : 1
            }]
        }
        className={clsx(`border flex ${icon && "flex-row gap-2 items-center justify-center"} text-center rounded-3xl h-12 items-center justify-center self-center px-5`, className)}
        activeOpacity={.8}
        {...rest}
    >
        {icon}
        {children && <Text
            className={clsx(`text-base font-medium text-center ${icon && "relative -top-[1px]"}`, textClassName)}
            style={[textStyle, { color: active ? colors.background : colors.textPrimary }]}>
            {children}
        </Text>}
    </TouchableOpacity>
}
