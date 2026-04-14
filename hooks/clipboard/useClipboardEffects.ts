import { useHandleGoBack } from "@/hooks/useHandleGoBack"
import { useToast } from "@/hooks/useToast"
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import type { MutationEffect } from "@/types/types"
import { useBackHandler } from "../useBackHandler"

export function useClipboardEffects(id: string, mutations: MutationEffect) {
    const toast = useToast()
    const handleGoBack = useHandleGoBack()
    const queryClient = useQueryClient()
    const { dismiss } = useBottomSheetModal()

    const { isError: isErrorDelete, data: dataDelete, isSuccess: isSucessDelete } = mutations.deleteMutation
    const { isError: isErrorEdit, data: dataEdit, isSuccess: isSuccessEdit } = mutations.editMutation
    const { isError: isErrorFavorite, data: dataFavorite, isSuccess: isSuccessFavorite } = mutations.favoriteMutation

    useBackHandler(() => {
        handleGoBack()
        return true
    })

    useEffect(() => {
        if (isErrorDelete) {
            toast.show("Erreur de suppression", {
                type: "danger"
            })
            handleGoBack()
            return
        }

        if (isSucessDelete && dataDelete) {
            toast.show(dataDelete.message, {
                type: dataDelete.success ? "success" : "warning"
            })
            handleGoBack()
            queryClient.invalidateQueries({ queryKey: ["all"] })
        }

    }, [isErrorDelete, dataDelete, toast])

    useEffect(() => {
        if (isErrorEdit) {
            toast.show("Erreur de mise à jour", {
                type: "danger"
            })
            handleGoBack()
            return
        }

        if (isSuccessEdit && dataEdit) {
            toast.show(dataEdit.message, {
                type: dataEdit.success ? "success" : "warning"
            })

            if (dataEdit.success) {
                queryClient.invalidateQueries({ queryKey: [`clipboard/${id}`] })
                queryClient.invalidateQueries({ queryKey: ["all"] })
            } else {
                handleGoBack()
            }

            dismiss()
        }
    }, [isErrorEdit, dataEdit, toast])

    useEffect(() => {
        if (isErrorFavorite) {
            toast.show("Erreur de mise en favoris", {
                type: "danger"
            })
            return
        }

        if (isSuccessFavorite && dataFavorite?.success) {
            queryClient.invalidateQueries({ queryKey: ["all"] })
            queryClient.invalidateQueries({ queryKey: [`clipboard/${id}`] })
        }
    }, [isSuccessFavorite, dataFavorite, toast, isErrorFavorite])
}