import {View} from "@/components/View";
import {ThemedText} from "@/components/ThemedText";
import {ScrollView, TouchableOpacity, View as NativeView} from "react-native"
import {Data} from "@/types/types";
import Feather from '@expo/vector-icons/Feather';
import {useThemeColor} from "@/hooks/useThemeColor";
import {SyncColor} from "@/constants/Colors";

type DeviceItemProps = {
    type: Data["source"]
    name: string
    statut: "Online" | "Offline"
}

export function Devices() {
    return <View style={{flex: 1}}>
        <ThemedText className="text-3xl font-bold">
            Appareils
        </ThemedText>
        <View className="mt-8">
            <ThemedText className="font-bold uppercase text-sm mb-4">Cet appareil</ThemedText>
            <DeviceItem type="Mobile" name="Tecno KL5" statut="Online"/>
        </View>
        <View className="mt-8" style={{flex: 1}}>
            <ThemedText className="font-bold uppercase text-sm mb-4">Autre appareils</ThemedText>
            <ScrollView showsVerticalScrollIndicator={false}contentContainerStyle={{paddingBottom: 36, gap: 12}}>
                {Array.from({length: 4}).map((a, index) => (
                    <DeviceItem type="PC" name="HP EliteBook 1030 G2" statut="Offline" key={index} />
                ))}
            </ScrollView>
        </View>
    </View>
}

function DeviceItem({type, name, statut}: DeviceItemProps) {
    const {colors} = useThemeColor()
    const iconName = type === "Mobile" ? "smartphone" : "monitor"
    const isOnline = statut === "Online"
    return <TouchableOpacity
        style={{
            borderColor: isOnline ? colors.tagSourceBorderColor : "",
            borderWidth: isOnline ? 3 : 0,
            backgroundColor: colors.box
        }}
        activeOpacity={isOnline ? 1 : .7}
        className="p-4 rounded-3xl"
    >
        <NativeView className="flex-row items-center gap-4">
            <NativeView
                style={{backgroundColor: colors.background}}
                className="rounded-xl h-14 w-14 items-center justify-center"
            >
                <Feather name={iconName} size={24} color={colors.textPrimary} className="opacity-50"/>
            </NativeView>
            <NativeView>
                <ThemedText className="font-bold text-lg opacity-80">{name}</ThemedText>
                <ThemedText
                    className="text-sm font-semibold"
                    style={{color: isOnline ? SyncColor["OK"] : SyncColor["NO"]}}
                >
                    {isOnline ? "En ligne" : "Déconnecté"}
                </ThemedText>
            </NativeView>
        </NativeView>
    </TouchableOpacity>
}