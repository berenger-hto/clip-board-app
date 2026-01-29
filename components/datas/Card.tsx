import {View, type ViewProps, Text, useColorScheme, Alert, Pressable} from "react-native"
import {Data} from "@/types/types";
import {clsx} from "clsx";
import {useThemeColor} from "@/hooks/useThemeColor";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {TagColor} from "@/constants/Color";
import {ThemedText} from "@/components/ThemedText";
import {openURL} from "@/functions/openURL"
import {Button} from "@/components/forms/Button";
import {setStringAsync} from "expo-clipboard"
import {useRouter} from "expo-router";


type Props = ViewProps & {
    data: Data
}

export function Card({data, className, style, ...rest}: Props) {
    const {colors, isDark} = useThemeColor()
    const headerTextColor = isDark ? "#94a3b8" : "#64748b"
    const {type, duration, from, value, id} = data
    const router = useRouter()

    const addToClipboard = async () => {
        try {
            await setStringAsync(value)
        } catch (e) {
            const error = (e as Error).toString()
            Alert.alert("Error !", error)
        }
    }

    return <Pressable onPress={() => router.push(`/card/[${id}]`)}>
        <View
            style={[style, {
                backgroundColor: colors.box,
                elevation: 1,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.18,
                shadowRadius: 1.0
            }]}
            className={clsx(`p-4 rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"}`, className)}
            {...rest}
        >
            {/* Card Header */}
            <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row gap-4">
                    <Tag type={type}/>
                    <From from={from} color={headerTextColor}/>
                </View>
                <Text className="text-[10px]" style={{color: headerTextColor}}>{duration}</Text>
            </View>

            {/*Card body*/}
            <View className="mt-4">
                <DataObj data={value} type={type}/>
            </View>

            {/*Card Footer*/}
            <View className="flex-row justify-between mt-4">
                <View className="flex flex-row gap-2">
                    <Button icon={<FontAwesome name="star" size={18} color={colors.iconColor}/>}></Button>
                    <Button icon={<Entypo name="share" size={18} color={colors.iconColor}/>}></Button>
                </View>
                <Button
                    active
                    icon={<FontAwesome6 name="copy" size={14} color={"#fff"}/>}
                    onPress={addToClipboard}
                >
                    Copier
                </Button>
            </View>
        </View>
    </Pressable>
}

function Tag({type}: { type: Data['type'] }) {
    const colorScheme = useColorScheme() ?? "dark"
    return <View
        style={{backgroundColor: TagColor[colorScheme][type]['background']}}
        className="self-center px-3 py-1 rounded-lg">
        <ThemedText
            style={{color: TagColor[colorScheme][type]["color"]}}
            className="text-[10px] font-bold tracking-wider">
            {type}
        </ThemedText>
    </View>
}

function From({from, color}: { from: Data['from'], color: string }) {
    return <View className="flex flex-row items-center justify-center gap-1">
        {from.toLowerCase() === "mobile" ?
            <Entypo name="mobile" size={10} color={color}/>
            :
            <FontAwesome name="desktop" size={13} color={color}/>
        }
        <ThemedText style={{color}} className="text-[10px] relative -top-[1px]">From {from}</ThemedText>
    </View>
}

function DataObj({data, type}: { data: string, type: Data['type'] }) {
    const {isDark} = useThemeColor()
    return <View>
        {
            type === "URL" &&
            <ThemedText
                className="text-lg underline"
                onPress={() => openURL(data)}
            >
                {data}
            </ThemedText>
        }
        {
            type === "TEXT" &&
            <ThemedText className="text-lg">
                {data}
            </ThemedText>
        }
        {
            type === "CODE" &&
            <View
                className={`"bg-slate-50 p-3 rounded-lg border border-slate-100 ${isDark && "!bg-[#111618] !border-slate-800"}`}>
                <Text className="text-xs text-[#13a4ec] font-mono leading-relaxed">
                    {data}
                </Text>
            </View>
        }
    </View>
}

