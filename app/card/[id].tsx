import {ThemedText} from "@/components/ThemedText";
import {SafeAreaView} from "@/components/SafeAreaView";
import {useLocalSearchParams} from "expo-router";
import {CardPreviewHeader} from "@/components/ui/CardPreview/CardPreviewHeader";
import {View} from "@/components/View";
import {View as NativeView, Text, ScrollView, TouchableOpacity} from "react-native"
import {useThemeColor} from "@/hooks/useThemeColor";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Data} from "@/types/types";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {Button} from "@/components/forms/Button";
import {DATA_MOCK} from "@/constants/fakeData";
import {NotFound} from "@/components/ui/NotFound";
import {addToClipboard} from "@/functions/addToClipboard";

export default function CardPreview() {
    const { id } = useLocalSearchParams()
    const data = DATA_MOCK.find(d => d.id === parseInt((id as string), 10))
    const {colors, isDark} = useThemeColor()

    if (!data) return <NotFound />

    return <SafeAreaView className="flex-1">
        <CardPreviewHeader/>
        <View className="p-4 flex-1">
            <View className="flex-1">
                <View className="flex-row items-start gap-2">
                    <InfoType type={data.type} source={data.source} />
                </View>
                <View className="flex-row items-center gap-2 mt-5 mb-6">
                    <MaterialCommunityIcons
                        name="clock"
                        size={15}
                        style={{opacity: .8}}
                        color={colors.tagSourceIconColor}
                    />
                    <ThemedText className="text-sm opacity-80">
                        {/* Garder le format 12:43 Oct 24, 2023 */}
                        Crée le: {data.createdAt}
                    </ThemedText>
                </View>
                <View>
                    <ScrollView
                        className="p-5 border rounded-2xl"
                        style={{
                            borderColor: "#e2e8f0",
                            height: 300
                        }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 40}}
                    >
                        <ThemedText className="opacity-90 leading-8">
                            {data.value}
                        </ThemedText>
                    </ScrollView>
                </View>
                <View
                    className="mt-6 border p-4 rounded-xl flex-row gap-4"
                    style={{
                        borderColor: colors.tagSourceBorderColor,
                        backgroundColor: colors.tagSourceBackground
                    }}
                >
                    <Entypo name="info-with-circle" size={20} className="top-1" color={colors.tagSourceIconColor}/>
                    <Text
                        style={{color: colors.tagSourceColor}}
                        className="text-sm pr-6"
                    >
                        L'information a été automatiquement synchronisée avec votre ordinateur.
                        Il est disponible sur tout vos appareils mobiles connectés.
                    </Text>
                </View>
            </View>
        </View>
        <View className="mb-6 p-4">
            <Button
                active
                icon={<Feather name="copy" size={18} color={"#fff"}/>}
                className="w-full h-16"
                textClassName="!text-lg !font-semibold"
                onPress={() => addToClipboard(data.value)}
            >
                Copier dans le presse-papier
            </Button>
            <View className="flex-row items-center justify-center gap-4 w-full mt-3">
                <TouchableOpacity
                    style={{borderColor: colors.tagSourceBorderColor, backgroundColor: colors.tagSourceBackground}}
                    className="flex-row gap-2 items-center justify-center border rounded-xl py-3 px-8 w-[48%]"
                    activeOpacity={.7}
                >
                    <Entypo name="pencil" size={18} color={colors.textPrimary}/>
                    <ThemedText className="opacity-80 font-bold text-lg">Editer</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{backgroundColor: colors.background}}
                    className={`flex-row gap-2 items-center justify-center border rounded-xl py-3 px-8 w-[48%] ${isDark ? "border-red-400/20" : "border-red-500/20"}`}
                    activeOpacity={.7}
                >
                    <Entypo name="code" size={18} className={`${isDark ? "!text-red-400" : "!text-red-500"}`}/>
                    <ThemedText
                        className={`opacity-80 font-bold text-lg ${isDark ? "!text-red-400" : "!text-red-500"}`}>Supprimer</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
}

function InfoType({type, source}: { type: Data["type"], source: Data["source"] }) {
    const {colors} = useThemeColor()

    return <NativeView className="flex-row gap-2">
        <NativeView
            style={{borderColor: colors.tagSourceBorderColor, backgroundColor: colors.tagSourceBackground}}
            className="p-3 py-2 self-center rounded-lg border"
        >
            <NativeView className="flex-row items-center gap-2">
                {
                    type === "CODE" ? <Feather name="code" size={16} color={colors.tagSourceIconColor}/> :
                        type === "URL" ? <Entypo name="link" size={16} color={colors.tagSourceIconColor}/> :
                            <Entypo name="text" size={16} color={colors.tagSourceIconColor}/>
                }
                <Text
                    className="uppercase text-sm font-semibold tracking-wider"
                    style={{color: colors.tagSourceColor}}>
                    Type: {type}
                </Text>
            </NativeView>
        </NativeView>
        <NativeView
            style={{borderColor: colors.tagSourceBorderColor, backgroundColor: colors.tagSourceBackground}}
            className="p-3 py-2 self-center rounded-lg border"
        >
            <NativeView className="flex-row items-center gap-2">
                {
                    source === "PC" ?
                        <FontAwesome name="desktop" size={16} color={colors.tagSourceIconColor}/>
                        : <Entypo name="mobile" size={16} color={colors.tagSourceIconColor}/>
                }
                <Text
                    className="uppercase text-sm font-semibold tracking-wider"
                    style={{color: colors.tagSourceColor}}>
                    Source: {source}
                </Text>
            </NativeView>
        </NativeView>
    </NativeView>
}