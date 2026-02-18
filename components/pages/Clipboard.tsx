import { ClipboardHeader } from "@/components/ui/ClipboardHeader";
import { ActivityIndicator, RefreshControl } from "react-native";
import { ClipboardCard } from "@/components/datas/ClipboardCard";
import { AddItemToClipboard } from "@/components/ui/AddItemToClipboard";
import { ThemedText } from "@/components/ThemedText";
import { FlatList } from "react-native-gesture-handler";
import { View } from "@/components/View";
import { useClipboardManagement } from "@/hooks/useClipboardManagement";
import { Button } from "../forms/Button";
import { useAppStore } from "@/store";

export function Clipboard() {

    const { data, isPending, isRefetching, refetch, token, ip } = useClipboardManagement()
    const setTabActiveIndex = useAppStore(state => state.setTabActiveIndex)

    return <>
        <ClipboardHeader />
        <View style={{ flex: 1 }}>
            <FlatList
                data={data}
                renderItem={({ item }) => <ClipboardCard data={item} />}
                keyExtractor={item => item.id}
                initialNumToRender={3}
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
                    flexGrow: 1
                }}
                ItemSeparatorComponent={() => <View className="h-2" />}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                alwaysBounceVertical={true}
                overScrollMode="always"
                nestedScrollEnabled={true}
            />
        </View>

        {/*Add item to clipboard*/}
        <AddItemToClipboard />
    </>
}