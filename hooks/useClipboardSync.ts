import { useEffect, useCallback, useRef, RefObject } from "react"
import { useAppStore } from "./useAppStore"
import { useSocketIO } from "./useSocketIO"
import * as Clipboard from "expo-clipboard"
import { useMutationQuery } from "./useMutationQuery"
import type { ClipboardPayload, ClipboardQuery, Data } from "@/types/types"
import { AppState } from "react-native";
import { useScrollToTop } from "./useScrollToTop"
import { FlashListRef } from "@shopify/flash-list"

type Query = Pick<ClipboardQuery, "refetch">

export function useClipboardSync(query: Query, listRef: RefObject<FlashListRef<Data> | null>) {
    const ip = useAppStore(state => state.ip)
    const token = useAppStore(state => state.token)
    const autoSync = useAppStore(state => state.autoSync)
    const { isConnected } = useSocketIO()
    const { refetch } = query
    const { mutate: insertToClipboard } = useMutationQuery<ClipboardPayload>("clipboard", "POST")
    const lastCopiedValue = useRef("")
    const scrollToTop = useScrollToTop(listRef)

    const syncClipboard = useCallback(async () => {
        if (!ip || !token || !isConnected || !autoSync) return

        try {
            const value = await Clipboard.getStringAsync()
            if (value && value !== lastCopiedValue.current) {
                lastCopiedValue.current = value;
                insertToClipboard({ content: value, type: "AUTO", source: "Mobile" })
            }
        } catch (e) {
            console.error("Erreur lors de l'insertion", e);
        }
    }, [ip, token, isConnected, autoSync, insertToClipboard])

    useEffect(() => {
        if (!ip || !token) return

        if (isConnected) {
            refetch()
        }

        scrollToTop(1000)

    }, [ip, token, isConnected])
    

    useEffect(() => {
        if (!ip || !token || !isConnected || !autoSync) return

        const appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === "active") {
                syncClipboard()
            }
        })

        const clipboardSubscription = Clipboard.addClipboardListener(() => {
            syncClipboard()
        })

        return () => {
            appStateSubscription.remove()
            Clipboard.removeClipboardListener(clipboardSubscription)
        }
    }, [ip, token, isConnected, autoSync, syncClipboard])
}