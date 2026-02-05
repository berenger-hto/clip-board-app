import {TextInput, TextInputProps, TextProps} from "react-native";
import {clsx} from "clsx";
import {useThemeColor} from "@/hooks/useThemeColor";
import {useState} from "react";
import {View} from "@/components/View";
import {ThemedText} from "@/components/ThemedText";

type Props = TextInputProps & {
    label?: string
    labelStyle?: TextProps
}

export function Input({ className, style, label, labelStyle, ...rest }: Props) {
    const { colors, isDark } = useThemeColor()
    const [isFocused, setIsFocused] = useState(false)

    return <View>
        {label && <ThemedText style={{...labelStyle}} className="mb-2 font-semibold">{label}</ThemedText>}
        <TextInput
            style={[{ backgroundColor: colors.box, color: colors.textPrimary, textAlignVertical: "center" }, style]}
            className={clsx(`text-lg h-14 border ${isDark ? "border-slate-800" : "border-slate-200"} ${(isFocused && isDark && "border-white/30")} ${isFocused && !isDark && "border-black/30"} rounded-2xl px-4`, className)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor={isDark ? "#bbb" : "#555"}
            multiline={false}
            numberOfLines={1}
            {...rest}
        />
    </View>
}