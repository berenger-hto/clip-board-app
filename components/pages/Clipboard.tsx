import { ClipboardHeader } from "@/components/ui/ClipboardHeader";
import { ActivityIndicator, RefreshControl } from "react-native";
import { ClipboardCard } from "@/components/datas/ClipboardCard";
import { View } from "@/components/View";
import { useClipboardManagement } from "@/hooks/useClipboardManagement";
import { useAppStore } from "@/store";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useRef, useEffect } from "react";
import { Data } from "@/types/types";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/forms/Button";

export function Clipboard() {

    const listRef = useRef<FlashListRef<Data> | null>(null)
    const { data, isPending, isRefetching, refetch, token, ip } = useClipboardManagement(listRef)
    const setTabActiveIndex = useAppStore(state => state.setTabActiveIndex)

    return <>
        <View style={{ flex: 1 }}>
            <ClipboardHeader />
            <FlashList
                ref={listRef}
                data={data ?? []}
                renderItem={({ item }) => <ClipboardCard data={item} />}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    (token && ip && isPending) ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <View className="items-center justify-center h-[60%]">
                            <ThemedText className="text-center text-xl font-bold mt-10 opacity-80 mb-4">
                                Aucune donnée
                            </ThemedText>
                            <Button onPress={() => setTabActiveIndex(1)}>Ajouter un appareil</Button>
                        </View>
                    )
                }
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                    />
                }
                contentContainerStyle={{
                    paddingVertical: 6,
                    paddingBottom: 20,
                }}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    </>
}
