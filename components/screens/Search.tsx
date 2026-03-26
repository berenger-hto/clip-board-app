import { View } from "@/components/View"
import { ThemedText } from "@/components/ThemedText"
import { SearchInput } from "@/components/ui/SearchInput"
import { ClipboardCard } from "@/components/datas/ClipboardCard"
import { FlashList } from "@shopify/flash-list"
import { useAppStore } from "@/hooks/useAppStore"
import { useSearchItem } from "@/hooks/useSearchItem"
import { ActivityIndicator, Pressable, TextInput } from "react-native"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useEffect, useRef } from "react"

export function Search() {
    const { colors } = useThemeColor()
    const inputRef = useRef<TextInput>(null)
    const tabActiveIndex = useAppStore(state => state.tabActiveIndex)
    const storedData = useAppStore(state => state.data)
    const { searchTerm, debouncedSearchTerm, search, isLoading, results, setResults, isOfflineMode } = useSearchItem()
    
    const handleClear = () => {
        search("")
        setResults([])
    }

    useEffect(() => {
        if (tabActiveIndex === 1) return

        inputRef.current?.blur()
        const timer = setTimeout(() => {
            handleClear()
        }, 500)

        return () => clearTimeout(timer)
    }, [tabActiveIndex])

    useEffect(() => {
        console.log("Result", results)
    }, [results])

    return <View className="flex-1">
        <View className="flex-row items-center justify-between">
            <ThemedText className="text-3xl font-bold">
                Rechercher
            </ThemedText>
        </View>
        <View className="mt-8">
            <SearchInput
                inputRef={inputRef}
                placeholder="Faire une recherche"
                onChangeText={search}
                value={searchTerm}
            />
        </View>
        <View className="mt-6 flex-row items-center justify-between px-1">
            <ThemedText className="font-bold text-sm uppercase opacity-70">
                Résultats
            </ThemedText>
            {results.length > 0 && <Pressable onPress={handleClear}>
                <ThemedText
                    style={{ color: colors.primary }}
                    className="font-semibold text-base"
                >
                    Tout vider
                </ThemedText>
            </Pressable>}
        </View>
        <View className="flex-1 mt-4">
            <FlashList
                data={results}
                renderItem={({ item }) => <ClipboardCard data={item} />}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View className="-mt-4">
                        {isLoading ? <ActivityIndicator size="large" color={colors.primary} className="mt-4" /> :
                            isOfflineMode && !storedData ? 
                                <ThemedText className="text-center text-xl font-bold mt-10 opacity-80 mb-4">
                                    Recherche hors ligne impossible
                                </ThemedText> :
                            debouncedSearchTerm.length > 0 ? <ThemedText className="text-center text-xl font-bold mt-10 opacity-80 mb-4">
                                Aucun résultat
                            </ThemedText> :
                                <ThemedText className="text-center text-xl font-bold mt-10 opacity-80 mb-4">
                                    Rechercher quelque chose pour commencer
                                </ThemedText>
                        }
                    </View>
                }
                contentContainerStyle={{
                    paddingVertical: 6,
                    paddingBottom: 20,
                }}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
            />
        </View>
    </View>
}