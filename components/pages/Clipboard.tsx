import { ClipboardHeader } from "@/components/ui/ClipboardHeader";
import { ActivityIndicator } from "react-native";
import { ClipboardCard } from "@/components/datas/ClipboardCard";
import { AddItemToClipboard } from "@/components/ui/AddItemToClipboard";
import { useEffect } from "react";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useToast } from "react-native-toast-notifications";
import { useAppStore } from "@/store";
import { ThemedText } from "@/components/ThemedText";
import { useSocketIO } from "@/hooks/useSocketIO";
import { FlatList } from "react-native-gesture-handler";
import { View } from "@/components/View";

export function Clipboard() {
    const { data, isPending, isSuccess, isError, refetch, isRefetching } = useFetchQuery("v1/clipboard")
    const toast = useToast()
    const isRedirect = useAppStore(state => state.isRedirect)
    const setIsRedirect = useAppStore(state => state.setIsRedirect)
    const { socket } = useSocketIO()

    useEffect(() => {
        if (isError) {
            toast.show("Le logiciel serveur est injoignable", {
                type: "danger"
            })
        }

        if (!isRedirect) return
        setIsRedirect(false)

        if (data && isSuccess) {
            toast.show(data.message, {
                type: data.success ? "success" : "danger"
            })
        }

    }, [data, isPending, isSuccess, isError, isRedirect])

    useEffect(() => {
        if (!socket) return
        socket.on("clipboard", () => {
            refetch()
        })
    }, [socket])

    return <>
        <ClipboardHeader />
        <FlatList
            data={data?.data}
            renderItem={({ item }) => <ClipboardCard data={item} />}
            keyExtractor={item => (item.id).toString()}
            initialNumToRender={3}
            ListEmptyComponent={
                isPending ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <ThemedText className="text-center text-2xl mt-10">
                        Aucun élément
                    </ThemedText>
                )
            }
            refreshing={isRefetching}
            onRefresh={refetch}
            contentContainerStyle={{
                paddingVertical: 16,
            }}
            ItemSeparatorComponent={() => <View className="h-2" />}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />

        {/*Add item to clipboard*/}
        <AddItemToClipboard />
    </>
}

function Load() {
    return <ThemedText>
        Synchronisation en cours ...
    </ThemedText>
}