import { View, type ViewProps, Text, useColorScheme, Alert, Pressable } from "react-native"
import { Data } from "@/types/types";
import { clsx } from "clsx";
import { useThemeColor } from "@/hooks/useThemeColor";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { TagColor } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { openURL } from "@/functions/openURL"
import { Button } from "@/components/forms/Button";
import { useRouter } from "expo-router";
import { addToClipboard } from "@/functions/addToClipboard";
import { memo } from "react";

type Props = ViewProps & {
    data: Data
}

export const ClipboardCard = memo(function ClipboardCard({ data, className, style, ...rest }: Props) {
    const { colors, isDark } = useThemeColor()
    const headerTextColor = isDark ? "#94a3b8" : "#64748b"
    const { type, createdAt, source, value, id } = data
    const router = useRouter()

    return <Pressable onPress={() => router.push(`/card/${id}`)}>
        <View
            style={[style, {
                backgroundColor: colors.box,
                elevation: 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.18,
                shadowRadius: 1.0
            }]}
            className={clsx(`p-4 rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"}`, className)}
            {...rest}
        >
            {/* CardPreviewHeader */}
            <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row gap-4">
                    <Tag type={type} />
                    <From source={source} color={headerTextColor} />
                </View>
                <Text className="text-[10px]" style={{ color: headerTextColor }}>{new Date(createdAt).toLocaleString()}</Text>
            </View>

            {/*Card body*/}
            <View className="mt-4">
                <DataObj data={value?.slice(0, 300)} type={type} />
            </View>

            {/*Card Footer*/}
            <View className="flex-row justify-between mt-4">
                <View className="flex flex-row gap-2">
                    <Button icon={<FontAwesome name="star" size={18} color={colors.iconColor} />}></Button>
                    <Button icon={<Entypo name="share" size={18} color={colors.iconColor} />}></Button>
                </View>
                <Button
                    active
                    icon={<FontAwesome6 name="copy" size={14} color={"#fff"} />}
                    onPress={() => addToClipboard(value)}
                >
                    Copier
                </Button>
            </View>
        </View>
    </Pressable>
})

const Tag = memo(function Tag({ type }: { type: Data['type'] }) {
    const colorScheme = useColorScheme() ?? "dark"
    return <View
        style={{ backgroundColor: TagColor[colorScheme][type]['background'] }}
        className="self-center px-3 py-1 rounded-lg">
        <ThemedText
            style={{ color: TagColor[colorScheme][type]["color"] }}
            className="text-[10px] font-bold tracking-wider">
            {type}
        </ThemedText>
    </View>
})

const From = memo(function From({ source, color }: { source: Data['source'], color: string }) {
    return <View className="flex flex-row items-center justify-center gap-1">
        {source.toLowerCase() === "mobile" ?
            <Entypo name="mobile" size={10} color={color} />
            :
            <FontAwesome name="desktop" size={13} color={color} />
        }
        <ThemedText style={{ color }} className="text-[10px] relative -top-[1px]">From {source}</ThemedText>
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

