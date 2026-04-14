import { View } from "@/components/View"
import { ScrollView } from "react-native"
import { ThemedText } from "@/components/ThemedText"
import { Text } from "react-native"
import { InfoType } from "@/components/clipboard/InfoType"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Entypo from '@expo/vector-icons/Entypo'
import { useThemeColor } from "@/hooks/useThemeColor"
import type { Data } from "@/types/types"

export function CardContent({ data }: { data: Data }) {
    const { colors } = useThemeColor()

    return <View className="p-4 flex-1">
        <View className="flex-1">
            <View className="flex-row items-start gap-2">
                <InfoType type={data.type} source={data.source} />
            </View>
            <View className="flex-row items-center gap-2 mt-5 mb-6">
                <MaterialCommunityIcons
                    name="clock"
                    size={15}
                    style={{ opacity: .8 }}
                    color={colors.tagSourceIconColor}
                />
                <ThemedText className="text-sm opacity-80">
                    Crée le: {new Date(data.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} {new Date(data.createdAt).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                    contentContainerStyle={{ paddingBottom: 40 }}
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
                <Entypo name="info-with-circle" size={20} className="top-1" color={colors.tagSourceIconColor} />
                <Text
                    style={{ color: colors.tagSourceColor }}
                    className="text-sm pr-6"
                >
                    Cette information a été automatiquement synchronisée avec ton ordinateur.
                    Elle est maintenant disponible sur tous tes appareils connectés.
                </Text>
            </View>
        </View>
    </View>
}