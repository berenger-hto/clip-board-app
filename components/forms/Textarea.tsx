import {TextInput, TextInputProps, TextProps} from "react-native";
import {clsx} from "clsx";
import {useThemeColor} from "@/hooks/useThemeColor";
import React, {RefObject, useState} from "react";
import {View} from "@/components/View";
import {ThemedText} from "@/components/ThemedText";

type Props = TextInputProps & {
    label?: string
    labelStyle?: TextProps
    height?: number
    textareaRef?: RefObject<TextInput | null>
}

export function Textarea({ className, style, label, labelStyle, height, textareaRef, ...rest }: Props) {
    const { colors, isDark } = useThemeColor()
    const [isFocused, setIsFocused] = useState(false)

    return <View>
        {label && <ThemedText style={{...labelStyle}} className="mb-2 font-semibold">{label}</ThemedText>}
        <TextInput
            style={[{ 
                backgroundColor: colors.box, 
                color: colors.textPrimary, 
                borderColor: isFocused ? colors.primary : colors.borderNavColor,
                height: height ?? 200, 
                textAlignVertical: "top" 
            }, style]}
            className={clsx(`text-lg border rounded-2xl p-4`, className)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor={colors.iconColor}
            multiline={true}
            scrollEnabled={true}
            ref={textareaRef}
            {...rest}
        />
    </View>
}