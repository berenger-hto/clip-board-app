import {ThemedText} from "@/components/ThemedText";
import {SafeAreaView} from "@/components/SafeAreaView";
import {useLocalSearchParams} from "expo-router";
import {Header} from "@/components/ui/CardPreview/Header";
import {View} from "@/components/View";
import {View as NativeView, Text, ScrollView, Pressable, TouchableOpacity} from "react-native"
import {useThemeColor} from "@/hooks/useThemeColor";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Data} from "@/types/types";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {Button} from "@/components/forms/Button";

export default function CardPreview() {
    const {id} = useLocalSearchParams()
    const { colors, isDark} = useThemeColor()

    return <SafeAreaView className="flex-1">
        <Header/>
        <View className="p-4 flex-1">
            <View className="flex-1">
                <View className="flex-row items-start gap-2">
                    <Type type="URL"/>
                    <Source source="Mobile"/>
                </View>
                <View className="flex-row items-center gap-2 mt-5 mb-6">
                    <MaterialCommunityIcons name="clock" size={15} style={{opacity: .8}} color={colors.tagSourceIconColor}/>
                    <ThemedText className="text-sm opacity-80">
                        Crée le: 12:43 Oct 24, 2023
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
                            L'intégration de React Native avec Expo SDK 54 marque une étape charnière dans le développement mobile cross-platform. En utilisant des outils comme NativeWind pour le stylisage et Zustand pour la gestion d'état, nous créons une architecture non seulement performante mais aussi extrêmement maintenable.
                            Le défi majeur réside souvent dans la gestion de la persistance des données. Bien que l'AsyncStorage ait rendu de fiers services, l'arrivée de MMKV change la donne en offrant des lectures et écritures synchrones grâce à son moteur écrit en C++. Cela élimine les sauts d'interface utilisateur (UI glitches) souvent observés lors du chargement initial des données.
                            Imaginez une application capable de synchroniser instantanément des snippets de code entre un PC et un appareil mobile. L'utilisateur copie une fonction complexe sur son IDE, et celle-ci apparaît immédiatement dans sa liste, formatée avec une coloration syntaxique impeccable et prête à être partagée ou réutilisée. C'est la promesse d'une productivité sans friction.
                            Pour tester le débordement de contenu (overflow), il est crucial d'avoir des paragraphes qui s'étendent sur plusieurs lignes. Voici un exemple de bloc de texte dense : le développement d'applications mobiles nécessite une attention particulière à la gestion de la mémoire, à l'optimisation des rendus de listes via FlashList ou FlatList, et à la réactivité des gestes utilisateur. Chaque milliseconde gagnée sur le fil de rendu principal (Main Thread) contribue à cette sensation de fluidité 'native' que les utilisateurs recherchent tant.
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
                    <Entypo name="info-with-circle" size={20} className="top-1" color={colors.tagSourceIconColor} />
                    <Text
                        style={{color: colors.tagSourceColor}}
                        className="text-sm pr-6"
                    >
                        L'information a été automatiquement synchronisée avec votre ordinateur
                        Il est disponible sur tout vos appareils mobiles
                    </Text>
                </View>
            </View>
        </View>
        <View className="mb-6 p-4">
            <Button
                active
                icon={<Feather name="copy" size={18} color={"#fff"} />}
                className="w-full h-16"
                textClassName="!text-lg !font-semibold"
            >
                Copier dans le presse-papier
            </Button>
            <View className="flex-row items-center justify-center gap-4 w-full mt-3">
                <TouchableOpacity
                    style={{ borderColor: colors.tagSourceBorderColor, backgroundColor: colors.tagSourceBackground }}
                    className="flex-row gap-2 items-center justify-center border rounded-xl py-3 px-8 w-[48%]"
                    activeOpacity={.7}
                >
                    <Entypo name="pencil" size={18} color={colors.textPrimary} />
                    <ThemedText className="opacity-80 font-bold text-lg">Editer</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ backgroundColor: colors.background }}
                    className={`flex-row gap-2 items-center justify-center border rounded-xl py-3 px-8 w-[48%] ${isDark ? "border-red-400/20" : "border-red-500/20"}`}
                    activeOpacity={.7}
                >
                    <Entypo name="code" size={18} className={`${isDark ? "!text-red-400" : "!text-red-500"}`} />
                    <ThemedText className={`opacity-80 font-bold text-lg ${isDark ? "!text-red-400" : "!text-red-500"}`}>Supprimer</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
}

function Type({type}: { type: Data['type'] }) {
    const {colors} = useThemeColor()

    return <NativeView
        style={{borderColor: colors.tagTypeBorderColor, backgroundColor: colors.tagTypeBackground}}
        className="p-3 py-2 self-center rounded-lg border"
    >
        <NativeView className="flex-row items-center gap-2">
            {
                type === "CODE" ? <Feather name="code" size={16} color={colors.tagTypeIconColor}/> :
                    type === "URL" ? <Entypo name="link" size={16} color={colors.tagTypeIconColor}/> :
                        <Entypo name="text" size={16} color={colors.tagTypeIconColor}/>
            }
            <Text
                className="uppercase text-sm font-semibold tracking-wider"
                style={{color: colors.tagTypeColor}}>
                Type: {type}
            </Text>
        </NativeView>
    </NativeView>
}

function Source({source}: { source: Data["from"] }) {
    const {colors} = useThemeColor()

    return <NativeView
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
}