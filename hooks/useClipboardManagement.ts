import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/hooks/useAppStore";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketIO } from "@/hooks/useSocketIO";
import { RefObject, useCallback, useEffect, useRef } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { Data } from "@/types/types";
import * as Clipboard from "expo-clipboard"
import { useMutationQuery } from "./useMutationQuery";
import { useFilterItem } from "./useFilterItem";

export function useClipboardManagement(listRef: RefObject<FlashListRef<Data> | null>) {
    const token = useAppStore(state => state.token)
    const ip = useAppStore(state => state.ip)

    const {
        data: clipboardData,
        isPending: isClipboardPending,
        isSuccess: isClipboardSuccess,
        isError: isClipboardError,
        refetch: refetchClipboard,
        isRefetching: isClipboardRefetching,
        isRefetchError: isClipboardRefetchError
    } = useFetchQuery<{ data: Data[] }>("clipboard", undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: !!ip && !!token
    })
    const { mutate: insertToClipboard } = useMutationQuery<{ content: string, type: string, source: string }>("clipboard", "POST")
    const filterIndicator = useAppStore(state => state.filterIndicator)

    const { filterSuccess, data: filterData, isFilterPending, isFilterError, refetchFilter, isOffline } = useFilterItem()

    const toast = useToast()
    const isRedirect = useAppStore(state => state.isRedirect)
    const setIsRedirect = useAppStore(state => state.setIsRedirect)
    const queryClient = useQueryClient()
    const { socket, isConnected } = useSocketIO()

    const isFiltering = filterIndicator !== "ALL"
    const data = isFiltering ? filterData : clipboardData?.data
    const isPending = isFiltering ? isFilterPending : isClipboardPending
    const isSuccess = isFiltering ? filterSuccess : isClipboardSuccess
    const isError = isFiltering ? isFilterError : isClipboardError
    const refetch = isFiltering ? refetchFilter : refetchClipboard
    const isRefetching = isFiltering ? false : isClipboardRefetching
    const isRefetchError = isFiltering ? false : isClipboardRefetchError
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
        refetch()
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
            if (!clipboardData.success) queryClient.invalidateQueries({ queryKey: ["clipboard"] })
            toast.show(clipboardData.message, {
                type: clipboardData.success ? "success" : "danger"
            })
        }

    }, [clipboardData, isPending, isSuccess, isError, isRedirect, ip, token])

    const initialSyncDone = useRef(false)

    useEffect(() => {
        if (!ip || !token || !isConnected || !autoSync || initialSyncDone.current || !isConnected) return

        initialSyncDone.current = true
        Clipboard.getStringAsync().then(value => {
            if (value) {
                insertToClipboard({ content: value, type: "AUTO", source: "Mobile" })
            }
        })
    }, [ip, token, isConnected, autoSync, insertToClipboard, isConnected])

    useEffect(() => {
        if (!socket || !autoSync || isOffline) return

        const handleClipboard = async () => {
            shouldScroll.current = true
            queryClient.invalidateQueries({ queryKey: ["filter?f=FAVORITES", "filter?f=URL", "filter?f=CODE", "filter?f=TEXT"] })
            await refetch()
        }

        socket.on("clipboard", handleClipboard)

        return () => {
            socket.off("clipboard", handleClipboard)
        }
    }, [socket, autoSync, refetch])

    useEffect(() => {
        if (!isConnected || !data) return
        refetch()
        scrollTopToRefetch(1000)
    }, [isConnected, data])

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
        clipboardData,
        scrollTopToRefetch,
        ip,
        token
    }
}