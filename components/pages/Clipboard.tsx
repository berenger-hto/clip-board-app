import { ClipboardHeader } from "@/components/ui/ClipboardHeader";
import { Keyboard, Pressable, ScrollView, View } from "react-native";
import { Card } from "@/components/datas/Card";
import { AddItemToClipboard } from "@/components/ui/AddItemToClipboard";
import { useEffect } from "react";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useToast } from "react-native-toast-notifications";
import { useAppStore } from "@/store";
import { ThemedText } from "../ThemedText";

export function Clipboard() {
    const { data, isPending, isSuccess, isError, refetch } = useFetchQuery("v1/clipboard")
    const toast = useToast()
    const isRedirect = useAppStore(state => state.isRedirect)
    const setIsRedirect = useAppStore(state => state.setIsRedirect)

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

    /*
    useEffect(() => {
        const interval = setInterval(refetch, 1500)
        return () => clearInterval(interval)
    }, [])
    */

    return <>
        <ClipboardHeader />
        <ScrollView
            className="flex-1 mt-2 rounded-xl"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            <Pressable onPress={Keyboard.dismiss}>
                {isPending && <Load />}
                {data && <View className="mt-5 gap-4">
                    {data?.data.map(d => (
                        <Card data={d} key={d.id} />
                    ))}
                </View>}
            </Pressable>
        </ScrollView>
        {/*Add item to clipboard*/}
        <AddItemToClipboard />
    </>
}

function Load() {
    return <ThemedText>
        Synchronisation en cours ...
    </ThemedText>
}