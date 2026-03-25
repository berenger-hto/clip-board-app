import { useToast } from "@/hooks/useToast"
import { BottomSheetModal, BottomSheetModalMethods } from "./BottomSheetModal"
import type { Data, SegmentedButtonType } from "@/types/types"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { TouchableOpacity } from "react-native"
import { useRef, useEffect } from "react"
import Feather from "@expo/vector-icons/Feather"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useMutationQuery } from "@/hooks/useMutationQuery"
import { useQueryClient } from "@tanstack/react-query"

export function AddItemToClipboard() {
    const toast = useToast()
    const { dismiss } = useBottomSheetModal()
    const modalRef = useRef<BottomSheetModalMethods>(null)
    const { colors } = useThemeColor()
    const { mutate, isSuccess, isError, isPending, data } = useMutationQuery<{ content: string, type: string, source: Data["source"] }>(`clipboard`, "POST")
    const queryClient = useQueryClient()

    const handleOpenModal = () => {
        modalRef.current?.open()
    }

    const handleAddToClipboard = (content: string, type: SegmentedButtonType) => {
        if (!content) {
            toast.show("Tapez quelque chose", {
                type: "warning"
            })
            return
        }

        mutate({ content, type, source: "Mobile" })
    }

    useEffect(() => {
        if (isError) {
            toast.show("Erreur d'ajout", {
                type: "danger"
            })
            return
        }

        if (isSuccess && data) {
            toast.show(data.message, {
                type: data.success ? "success" : "warning"
            })
            dismiss()
            queryClient.invalidateQueries({ queryKey: ["all"] })
        }


    }, [isPending, isSuccess, isError, data])

    return <>
        <TouchableOpacity
            className="absolute right-3 bottom-14 h-14 w-14 rounded-full items-center justify-center"
            style={{
                backgroundColor: colors.primary,
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }}
            activeOpacity={.9}
            onPress={handleOpenModal}
        >
            <Feather name="plus" size={20} color={colors.background} />
        </TouchableOpacity>

        <BottomSheetModal
            ref={modalRef}
            title="Ajouter au presse-papier"
            handleAction={handleAddToClipboard}
            actionButtonTitle={isPending ? "En cours" : "Ajouter au presse-papier"}
            buttonDisabled={isPending}
        />
    </>

}