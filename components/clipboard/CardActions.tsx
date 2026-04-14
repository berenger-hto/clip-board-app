import { View } from "@/components/View"
import { Button } from "@/components/forms/Button"
import { ThemedText } from "@/components/ThemedText"
import { TouchableOpacity } from "react-native"
import { useThemeColor } from "@/hooks/useThemeColor"
import Feather from '@expo/vector-icons/Feather'
import Entypo from '@expo/vector-icons/Entypo'
import { useAddToClipboard } from "@/hooks/useAddToClipboard"
import type { Data, MutationEffect, SegmentedButtonType } from "@/types/types"
import { useRef } from "react"
import { BottomSheetModalMethods } from "@/components/ui/BottomSheetModal"
import { BottomSheetModal } from "@/components/ui/BottomSheetModal"

type Props = {
    data: Data
    deleteMutation: MutationEffect["deleteMutation"]
    editMutation: MutationEffect["editMutation"]
    handleDelete: () => void
    handleEditClipboard: (value: string, segmentedButtonItem: SegmentedButtonType) => void
}

export function CardActions({ data, deleteMutation, editMutation, handleDelete, handleEditClipboard }: Props) {
    const copy = useAddToClipboard()
    const { colors, isDark } = useThemeColor()

    const modalRef = useRef<BottomSheetModalMethods>(null)

    const handleOpenModal = () => {
        modalRef.current?.open()
    }

    return <>
        <View className="mb-6 p-4">
            <Button
                active
                icon={<Feather name="copy" size={18} color={colors.background} />}
                className="w-full h-16"
                textClassName="!text-lg !font-semibold"
                style={{ borderRadius: 50 }}
                onPress={() => copy(data.value)}
            >
                Copier dans le presse-papier
            </Button>
            <View className="flex-row items-center justify-center gap-4 w-full mt-3">
                <TouchableOpacity
                    style={{ backgroundColor: colors.tagSourceBackground }}
                    className="flex-row gap-2 items-center justify-center rounded-3xl py-3 px-8 w-[48%]"
                    activeOpacity={.8}
                    onPress={handleOpenModal}
                >
                    <Entypo name="pencil" size={18} color={colors.textPrimary} />
                    <ThemedText className="opacity-80 font-bold text-lg">Editer</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row gap-2 items-center justify-center rounded-3xl py-3 px-8 w-[48%] ${isDark ? "bg-red-400/20" : "bg-red-500/20"} ${deleteMutation.isPending && "opacity-15"}`}
                    activeOpacity={deleteMutation.isPending ? .15 : 1}
                    onPress={handleDelete}
                    disabled={deleteMutation.isPending}
                >
                    <Entypo name="trash" size={18} className={`${isDark ? "!text-red-400" : "!text-red-500"}`} />
                    <ThemedText
                        className={`font-bold text-lg ${isDark ? "!text-red-400" : "!text-red-500"}`}>Supprimer</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
        <BottomSheetModal
            ref={modalRef}
            title="Editer le contenu"
            actionButtonTitle={editMutation.isPending ? "En cours..." : "Editer"}
            handleAction={handleEditClipboard}
            inputValue={data.value}
            buttonDisabled={editMutation.isPending}
            clearContentOnDismiss={false}
        />
    </>

}