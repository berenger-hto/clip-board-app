import { View as NativeView, Text } from "react-native"
import { useThemeColor } from "@/hooks/useThemeColor"
import Feather from "@expo/vector-icons/Feather"
import Entypo from "@expo/vector-icons/Entypo"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import type { Data } from "@/types/types"


export function InfoType({ type, source }: { type: Data["type"], source: Data["source"] }) {
    const { colors } = useThemeColor()

    return <NativeView className="flex-row gap-2">
        <NativeView
            style={{ borderColor: colors.tagSourceBorderColor, backgroundColor: colors.tagSourceBackground }}
            className="px-3 py-1 self-center rounded-3xl border"
        >
            <NativeView className="flex-row items-center gap-2">
                {
                    type === "CODE" ? <Feather name="code" size={12} color={colors.tagSourceIconColor} /> :
                        type === "URL" ? <Entypo name="link" size={12} color={colors.tagSourceIconColor} /> :
                            <Entypo name="text" size={12} color={colors.tagSourceIconColor} />
                }
                <Text
                    className="uppercase text-sm font-semibold tracking-wider"
                    style={{ color: colors.tagSourceColor }}
                >
                    {type}
                </Text>
            </NativeView>
        </NativeView>
        <NativeView
            style={{ borderColor: colors.tagSourceBorderColor, backgroundColor: colors.tagSourceBackground }}
            className="p-3 py-1 self-center rounded-2xl border"
        >
            <NativeView className="flex-row items-center gap-2">
                {
                    source === "PC" ?
                        <FontAwesome name="desktop" size={12} color={colors.tagSourceIconColor} />
                        : <Entypo name="mobile" size={12} color={colors.tagSourceIconColor} />
                }
                <Text
                    className="uppercase text-sm font-semibold tracking-wider"
                    style={{ color: colors.tagSourceColor }}>
                    {source}
                </Text>
            </NativeView>
        </NativeView>
    </NativeView>
}