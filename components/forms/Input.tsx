import {TextInput, TextInputProps, TextProps} from "react-native";
import {clsx} from "clsx";
import {useThemeColor} from "@/hooks/useThemeColor";
import {RefObject, useState} from "react";
import {View} from "@/components/View";
import {ThemedText} from "@/components/ThemedText";

export type InputProps = TextInputProps & {
    label?: string
    labelStyle?: TextProps
    inputRef?: RefObject<TextInput | null>
}

export function Input({ className, style, label, labelStyle, inputRef, ...rest }: InputProps) {
    const { colors } = useThemeColor()
    const [isFocused, setIsFocused] = useState(false)

    return <View>
        {label && <ThemedText style={{...labelStyle}} className="mb-2 font-semibold">{label}</ThemedText>}
        <TextInput
            style={[{ 
                backgroundColor: colors.box, 
                color: colors.textPrimary, 
                borderColor: isFocused ? colors.primary : colors.borderNavColor,
                textAlignVertical: "center" 
            }, style]}
            className={clsx(`text-lg h-14 border rounded-2xl px-4`, className)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor={colors.iconColor}
            multiline={false}
            numberOfLines={1}
            ref={inputRef}
            {...rest}
        />
    </View>
}