import { useMutationQuery } from "@/hooks/useMutationQuery"
import { useToast } from "@/hooks/useToast"
import type { DefaultResponse, EditMutation, SegmentedButtonType } from "@/types/types"
import { useCallback } from "react"

export function useClipboardActions(id: string) {
    const deleteMutation = useMutationQuery(`clipboard/${id}`, "DELETE")
    const editMutation = useMutationQuery<EditMutation, DefaultResponse>(`clipboard/${id}`, "PATCH")
    const favoriteMutation = useMutationQuery(`favorite/${id}`, "PATCH")
    const toast = useToast()

    const handleDelete = useCallback(() => {
        deleteMutation.mutate()
    }, [deleteMutation])

    const handleEditClipboard = useCallback((content: string, type: SegmentedButtonType) => {
        if (!content) {
            toast.show("Tapez quelque chose", {
                type: "warning"
            })
            return
        }
        editMutation.mutate({ content, type })
    }, [editMutation])

    const handleFavorite = useCallback(() => {
        favoriteMutation.mutate()
    }, [favoriteMutation])
    
    return {
        deleteMutation,
        editMutation,
        favoriteMutation,
        handleDelete,
        handleEditClipboard,
        handleFavorite
    }
}