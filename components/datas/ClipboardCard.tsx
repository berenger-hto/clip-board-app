import { View, type ViewProps, Text, Pressable, TouchableOpacity, GestureResponderEvent } from "react-native"
import { Data } from "@/types/types";
import { clsx } from "clsx";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TagColor } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { openURL } from "@/functions/openURL"
import { useRouter } from "expo-router";
import { memo } from "react";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import { capitalize } from "@/functions/capitalize";
import { share } from "@/functions/share";
import Feather from "@expo/vector-icons/Feather";
import { useAddToClipboard } from "@/hooks/useAddToClipboard";

type Props = ViewProps & {
    data: Data
}

export const ClipboardCard = memo(function ClipboardCard({ data, className, style, ...rest }: Props) {
    const { colors, isDark } = useThemeColor()
    const copy = useAddToClipboard()
    const headerTextColor = isDark ? "#94a3b8" : "#64748b"
    const { type, createdAt, source, value, id } = data
    const router = useRouter()
    const handleShareItem = (e: GestureResponderEvent) => {
        e.stopPropagation()
        share(value)
    }
    dayjs.extend(relativeTime)

    return <Pressable onPress={() => router.push(`/clipboard/${id}`)}>
        <View
            style={[style, {
                backgroundColor: colors.box,
                elevation: 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.18,
                shadowRadius: 1.0
            }]}
            className={clsx(`p-4 rounded-3xl border ${isDark ? "border-slate-800" : "border-slate-200"}`, className)}
            {...rest}
        >
            {/* CardPreviewHeader */}
            <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center justify-between w-full">
                    <View className="flex flex-row items-center justify-center gap-2">
                        <Tag type={type} />
                        <Text className="text-[10px]" style={{ color: headerTextColor }}>
                            {capitalize(dayjs(createdAt).locale('fr').fromNow(true))} • {source}
                        </Text>
                    </View>
                    <View className="flex flex-row items-center justify-center gap-5">
                        <TouchableOpacity
                            onPress={handleShareItem}
                            activeOpacity={.8}
                        >
                            <Feather name="share" size={18} color={colors.iconColor} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => copy(value)}
                            activeOpacity={.8}
                        >
                            <Feather name="copy" size={18} color={colors.iconColor} />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            {/*Card body*/}
            <View className="mt-4">
                <DataObj data={value?.slice(0, 300)} type={type} />
            </View>
        </View>
    </Pressable>
})

const Tag = memo(function Tag({ type }: { type: Data['type'] }) {
    const { isDark } = useThemeColor()
    return <View
        style={{ backgroundColor: TagColor[isDark ? "dark" : "light"][type]['background'] }}
        className="self-center px-3 py-1 rounded-lg">
        <ThemedText
            style={{ color: TagColor[isDark ? "dark" : "light"][type]["color"] }}
            className="text-[10px] font-bold tracking-wider">
            {type}
        </ThemedText>
    </View>
})

const DataObj = memo(function DataObj({ data, type }: { data: string, type: Data['type'] }) {
    const { isDark, colors } = useThemeColor()
    return <View>
        {
            type === "URL" &&
            <ThemedText
                className="text-base underline"
                onPress={() => openURL(data)}
            >
                {data}
            </ThemedText>
        }
        {
            type === "TEXT" &&
            <ThemedText className="text-base">
                {data}
            </ThemedText>
        }
        {
            type === "CODE" &&
            <View
                className={`"bg-slate-50 p-3 rounded-lg border border-slate-100 ${isDark && "!bg-[#111618] !border-slate-800"}`}>
                <Text style={{ color: colors.primary }} className="text-xs font-mono leading-relaxed">
                    {data}
                </Text>
            </View>
        }
    </View>
})

