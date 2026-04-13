import { useQueryClient } from "@tanstack/react-query"
import { useAppStore } from "./useAppStore"
import { useToast } from "./useToast"
import { useEffect } from "react"
import type { ClipboardQuery } from "@/types/types"

type Query = Pick<ClipboardQuery, "isError" | "isRefetchError" | "isSuccess" | "clipboardData">

export function useClipboardUI(query: Query) {
    const toast = useToast()
    const ip = useAppStore(state => state.ip)
    const token = useAppStore(state => state.token)
    const isRedirect = useAppStore(state => state.isRedirect)
    const setIsRedirect = useAppStore(state => state.setIsRedirect)
    const setClipboardIsLoad = useAppStore(state => state.setClipboardIsLoad)
    const { isError, isRefetchError, isSuccess, clipboardData } = query
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!ip || !token) return

        if (isError || isRefetchError) {
            toast.show("Serveur indisponible", {
                type: "danger"
            })
        }

        setClipboardIsLoad(clipboardData?.data ? clipboardData.data.length > 0 : false)

        if (!isRedirect) return
        setIsRedirect(false)

        if (clipboardData && isSuccess) {
            toast.show(clipboardData.message, {
                type: clipboardData.success ? "success" : "danger"
            })
        }

    }, [clipboardData, isSuccess, isError, isRedirect, ip, token, queryClient, isRefetchError])
}