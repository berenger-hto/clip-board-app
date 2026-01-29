import {TextInput, TextInputProps} from "react-native";
import {clsx} from "clsx";
import {useThemeColor} from "@/hooks/useThemeColor";
import {useState} from "react";

export function Input({ className, style, ...rest }: TextInputProps) {
    const { colors, isDark } = useThemeColor()
    const [isFocused, setIsFocused] = useState(false)

    return <TextInput
        style={[{ backgroundColor: colors.box, color: colors.textPrimary, textAlignVertical: "center" }, style]}
        className={clsx(`text-lg h-14 border ${isDark ? "border-slate-800" : "border-slate-200"} ${(isFocused && isDark && "border-white/30")} ${isFocused && !isDark && "border-black/30"} rounded-2xl px-4`, className)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={isDark ? "#bbb" : "#555"}
        multiline={false}
        numberOfLines={1}
        {...rest}
    />
}