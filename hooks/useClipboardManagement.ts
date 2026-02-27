import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useToast } from "react-native-toast-notifications";
import { useAppStore } from "@/hooks/useAppStore";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketIO } from "@/hooks/useSocketIO";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { Data } from "@/types/types";

export function useClipboardManagement(listRef: RefObject<FlashListRef<Data> | null>) {
    const { data: clipboardData, isPending, isSuccess, isError, refetch, isRefetching, isRefetchError } = useFetchQuery<{ data: Data[] }>("clipboard", undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
    const toast = useToast()
    const isRedirect = useAppStore(state => state.isRedirect)
    const setIsRedirect = useAppStore(state => state.setIsRedirect)
    const queryClient = useQueryClient()
    const { socket, isConnected } = useSocketIO()

    const token = useAppStore(state => state.token)
    const ip = useAppStore(state => state.ip)

    const data = clipboardData?.data
    const autoSync = useAppStore(state => state.autoSync)

    const shouldScroll = useRef(false)

    const scrollTopToRefetch = useCallback((duration: number = 100) => {
        if (listRef.current && data && data.length > 0) {
            setTimeout(() => {
                listRef.current?.scrollToIndex({
                    index: 0,
                    animated: true
                })
            }, duration)
        }
    }, [data])

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
            if (!clipboardData.success) queryClient.invalidateQueries({ queryKey: ["clipboard"] })
            toast.show(clipboardData.message, {
                type: clipboardData.success ? "success" : "danger"
            })
        }

    }, [clipboardData, isPending, isSuccess, isError, isRedirect, ip, token])

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
        if (!isConnected) return
        refetch()
        scrollTopToRefetch(1000)
    }, [isConnected])

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