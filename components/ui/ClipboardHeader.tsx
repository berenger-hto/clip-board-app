import { ThemedText } from "@/components/ThemedText";
import { Pressable, View as NativeView } from "react-native";
import { View } from "@/components/View";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterButtons } from "@/components/ui/FilterButtons";
import { SyncColor } from "@/constants/Colors";
import { useAppStore } from "@/hooks/useAppStore";
import { useSocketIO } from "@/hooks/useSocketIO";

export function ClipboardHeader() {
    const setTabActiveIndex = useAppStore(state => state.setTabActiveIndex)
    const { colors, isDark } = useThemeColor()
    const { isConnected } = useSocketIO()
    const syncState = isConnected ? "Connecté" : "Déconnecté"

    return <>
        <View className="items-center flex-row justify-between">
            <ThemedText className={`text-2xl font-bold ${!isDark && "opacity-75"}`}>ClipboardX</ThemedText>
            <Pressable onPress={() => setTabActiveIndex(2)}>
                <View className="flex items-center justify-center h-10 w-10 rounded-full">
                    <MaterialIcons name="devices" size={22} color={colors.textPrimary} className="opacity-50" />
                </View>
            </Pressable>
        </View>
        <View className="mb-4 flex flex-row gap-2 items-center">
            <NativeView className="h-2 w-2 rounded-full" style={{ backgroundColor: SyncColor[isConnected ? "OK" : "NO"] }} />
            <ThemedText className="text-sm">
                {syncState}
            </ThemedText>
        </View>
        <Pressable onPress={() => setTabActiveIndex(1)}>
            <SearchInput placeholder="Rechercher..." editable={false} />
        </Pressable>
        <FilterButtons />
    </>
}