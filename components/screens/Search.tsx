import { View } from "../View"
import { ThemedText } from "../ThemedText"
import { SearchInput } from "../ui/SearchInput"
import { DATA_MOCK } from "@/constants/fakeData"
import { ClipboardCard } from "../datas/ClipboardCard"
import { FlashList } from "@shopify/flash-list"
import { Button } from "../forms/Button"
import { useAppStore } from "@/hooks/useAppStore"

export function Search() {
    const setTabActiveIndex = useAppStore(state => state.setTabActiveIndex)

    return <View className="flex-1">
        <View className="flex-row items-center justify-between">
            <ThemedText className="text-3xl font-bold">
                Rechercher
            </ThemedText>
        </View>
        <View className="mt-8">
            <SearchInput placeholder="Recherche tes snippets, liens ou textes" />
        </View>
        <View className="flex-1 mt-8">
            <FlashList
                data={DATA_MOCK}
                renderItem={({ item }) => <ClipboardCard data={item} />}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View className="-mt-4">
                        <ThemedText className="text-center text-xl font-bold mt-10 opacity-80 mb-4">
                            Rechercher quelque chose pour commencer
                        </ThemedText>
                    </View>
                }
                contentContainerStyle={{
                    paddingVertical: 6,
                    paddingBottom: 20,
                }}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    </View>
}