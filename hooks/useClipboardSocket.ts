import { useAppStore } from "./useAppStore"
import { RefObject, useEffect, useRef } from "react"
import { useSocketIO } from "./useSocketIO"
import { useFilterItem } from "./useFilterItem"
import { useQueryClient } from "@tanstack/react-query"
import { FlashListRef } from "@shopify/flash-list"
import type { Data, ClipboardQuery } from "@/types/types"
import { useScrollToTop } from "./useScrollToTop"

type Query = Pick<ClipboardQuery, "refetch" | "data">

export function useClipboardSocket(query: Query, listRef: RefObject<FlashListRef<Data> | null>) {
    const { socket } = useSocketIO()
    const autoSync = useAppStore(state => state.autoSync)
    const { isOffline } = useFilterItem()
    const queryClient = useQueryClient()
    const { refetch, data } = query
    const refetchId = useRef(0)
    const lastHandledRefetchId = useRef(0)
    const scrollToTop = useScrollToTop(listRef)

    useEffect(() => {
        if (!socket || !autoSync || isOffline) return

        const handleClipboard = () => {
            refetchId.current += 1
            refetch()
        }

        socket.on("clipboard", handleClipboard)

        return () => {
            socket.off("clipboard", handleClipboard)
        }
    }, [socket, autoSync, queryClient])

    useEffect(() => {
        console.log("RefetchId", refetchId.current, "Last", lastHandledRefetchId.current)

        if (!data || data.length === 0) return
        if (refetchId.current === lastHandledRefetchId.current) return

        scrollToTop()

        lastHandledRefetchId.current = refetchId.current

    }, [data])
}