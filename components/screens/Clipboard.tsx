import { ClipboardHeader } from "@/components/ui/ClipboardHeader";
import { ActivityIndicator, RefreshControl } from "react-native";
import { ClipboardCard } from "@/components/datas/ClipboardCard";
import { View } from "@/components/View";
import { useClipboardManagement } from "@/hooks/useClipboardManagement";
import { useAppStore } from "@/hooks/useAppStore";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useRef } from "react";
import { Data } from "@/types/types";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/forms/Button";
import { AddItemToClipboard } from "../ui/AddItemToClipboard";
import { useQuery } from "@tanstack/react-query";

export function Clipboard() {

    const listRef = useRef<FlashListRef<Data> | null>(null)
    const { data, isPending, isRefetching, refetch, token, ip, scrollTopToRefetch } = useClipboardManagement(listRef)
    const setTabActiveIndex = useAppStore(state => state.setTabActiveIndex)
    const { data: testData } = useQuery({
        queryKey: ["clipboard"],
        queryFn: async () => {
            const response = await fetch(`http://192.168.1.106/clipboard`, {
                headers: {
                    "Authorization": `${token}`
                }
            })
            const data = await response.json()
            return data
        }
    })

    const { data: testData2 } = useQuery({
        queryKey: ["testss"],
        queryFn: async () => {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/1`)
            const data = await response.json()
            return data
        }
    })

    return <>
        <View style={{ flex: 1 }}>
            <ClipboardHeader />
            <ThemedText className="text-xs">
                Local test
                {JSON.stringify(testData)}
            </ThemedText>
            <ThemedText className="text-xs">
                External test
                {JSON.stringify(testData2)}
            </ThemedText>
            <FlashList
                className="flex-1 h-full"
                ref={listRef}
                data={data ?? []}
                renderItem={({ item }) => <ClipboardCard data={item} />}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    (token && ip && isPending) ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <View className="items-center justify-center">
                            <ThemedText className="text-center text-xl font-bold mt-10 opacity-80 mb-4">
                                Aucune donnée
                            </ThemedText>
                            {(!ip || !token) && <Button onPress={() => setTabActiveIndex(2)}>Ajouter un appareil</Button>}
                        </View>
                    )
                }
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={async () => {
                            await refetch()
                            if (data && data.length > 0 && !isRefetching) {
                                scrollTopToRefetch(1000)
                            }
                        }}
                    />
                }
                contentContainerStyle={{
                    paddingVertical: 6,
                    paddingBottom: 20,
                }}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
            />
            <AddItemToClipboard />
        </View>
    </>
}
