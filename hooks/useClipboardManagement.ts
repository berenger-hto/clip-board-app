import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useToast } from "react-native-toast-notifications";
import { useAppStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketIO } from "@/hooks/useSocketIO";
import { useSecureStore } from "@/hooks/useSecureStore";
import { RefObject, useCallback, useEffect, useState, useRef } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { Data } from "@/types/types";

export function useClipboardManagement(listRef: RefObject<FlashListRef<Data> | null>) {
    const { data: clipboardData, isPending, isSuccess, isError, refetch, isRefetching, isRefetchError } = useFetchQuery("v1/clipboard")
    const toast = useToast()
    const isRedirect = useAppStore(state => state.isRedirect)
    const setIsRedirect = useAppStore(state => state.setIsRedirect)
    const queryClient = useQueryClient()
    const { socket } = useSocketIO()
    const { getValue } = useSecureStore()
    const [token, setToken] = useState<string | null>(null)
    const [ip, setIp] = useState<string | null>(null)

    const data = clipboardData?.data
    const autoSync = useAppStore(state => state.autoSync)

    const shouldScroll = useRef(false)

    const scrollTopToRefetch = useCallback(() => {
        if (listRef.current && data && data.length > 0) {
            setTimeout(() => {
                listRef.current?.scrollToIndex({
                    index: 0,
                    animated: true
                })
            }, 100)
        }
    }, [data])

    useEffect(() => {
        getValue("ip").then((ip => setIp(ip)))
        getValue("token").then(token => setToken(token))
        console.log(ip, token)
    }, [ip, token])

    useEffect(() => {
        if (!ip || !token) return

        if (isError || isRefetchError) {
            toast.show("Le logiciel serveur est injoignable", {
                type: "danger"
            })
        }

        if (!isRedirect) return
        setIsRedirect(false)

        if (clipboardData && isSuccess) {
            if (!clipboardData.success) queryClient.invalidateQueries({ queryKey: ["v1/clipboard"] })
            toast.show(clipboardData.message, {
                type: clipboardData.success ? "success" : "danger"
            })
        }

    }, [clipboardData, isPending, isSuccess, isError, isRedirect])

    useEffect(() => {
        if (!socket || !autoSync) return

        const handleClipboard = async () => {
            shouldScroll.current = true
            await refetch()
        }

        socket.on("clipboard", handleClipboard)

        return () => {
            socket.off("clipboard", handleClipboard)
        }
    }, [socket, autoSync, refetch])

    useEffect(() => {
        if (shouldScroll.current && data && data.length > 0 && !isRefetching) {
            scrollTopToRefetch()
            shouldScroll.current = false
        }
    }, [data, isRefetching, scrollTopToRefetch])

    return {
        data,
        isPending,
        isSuccess,
        isError,
        refetch,
        isRefetching,
        isRefetchError,
        token,
        ip,
        clipboardData,
        scrollTopToRefetch
    }
}