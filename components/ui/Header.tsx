import {ThemedText} from "@/components/ThemedText";
import {Pressable, View as NativeView, Text} from "react-native";
import {View} from "@/components/View";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useThemeColor} from "@/hooks/useThemeColor";
import {SearchInput} from "@/components/ui/SearchInput";
import {FilterButtons} from "@/components/ui/FilterButtons";
import {useState} from "react";
import {SyncColor} from "@/constants/Colors";

export function Header() {
    const {colors} = useThemeColor()
    const [synchronizeState, setSynchronizeState] = useState<"OK" | "PENDING" | "NO">("OK")
    const syncState = synchronizeState === "OK" ? "Synchronisé" : synchronizeState === "PENDING" ? "En cours" : "Non synchronisé"

    return <>
        <View className="items-center flex-row justify-between">
            <ThemedText className="text-2xl font-bold opacity-90">
                Clipboard
            </ThemedText>
            <Pressable>
                <View className="flex items-center justify-center h-10 w-10 rounded-full">
                    <MaterialIcons name="devices" size={18} color={colors.textPrimary} className="opacity-50"/>
                </View>
            </Pressable>
        </View>
        <View className="mb-4 flex flex-row gap-2 items-center">
            <NativeView className="h-2 w-2 rounded-full" style={{backgroundColor: SyncColor[synchronizeState]}}/>
            <ThemedText className="text-sm">
                {syncState}
            </ThemedText>
        </View>
        <SearchInput/>
        <FilterButtons/>
    </>
}