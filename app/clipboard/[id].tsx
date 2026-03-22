import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "@/components/SafeAreaView";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CardPreviewHeader } from "@/components/ui/CardPreview/CardPreviewHeader";
import { View } from "@/components/View";
import { View as NativeView, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { useThemeColor } from "@/hooks/useThemeColor";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Data } from "@/types/types";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button } from "@/components/forms/Button";
import { NotFound } from "@/components/ui/NotFound";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import { BottomSheetModal, type BottomSheetModalMethods } from "@/components/ui/BottomSheetModal";
import type { DefaultResponse, SegmentedButtonType } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useAddToClipboard } from "@/hooks/useAddToClipboard";

export default function CardPreview() {
    const { id } = useLocalSearchParams()
    const { data: clipboardData, isPending, isError } = useFetchQuery<{ data: Data }>(`clipboard/${id}`)
    const data = clipboardData?.data
    const { colors, isDark } = useThemeColor()
    const toast = useToast()
    const { mutate: deleteMutate, isPending: isPendingDelete, isError: isErrorDelete, isSuccess: isSucessDelete, data: dataDelete } = useMutationQuery(`clipboard/${id}`, "DELETE")
    const { mutate: editMutate, isPending: isPendingEdit, isSuccess: isSuccessEdit, isError: isErrorEdit, data: dataEdit } = useMutationQuery<{ content: string, type: SegmentedButtonType }, DefaultResponse>(`clipboard/${id}`, "PATCH")
    const { mutate: favoriteMutate, isSuccess: isSuccessFavorite, isError: isErrorFavorite, data: dataFavorite, isPending: isPendingFavorite } = useMutationQuery(`favorite/${id}`, "PATCH")
    const queryClient = useQueryClient()
    const router = useRouter()
    const { dismiss } = useBottomSheetModal()
    const copy = useAddToClipboard()
    const handleDelete = () => {
        deleteMutate()
    }

    const modalRef = useRef<BottomSheetModalMethods>(null)

    const handleOpenModal = () => {
        modalRef.current?.open()
    }

    const handleEditClipboard = (content: string, type: SegmentedButtonType) => {
        editMutate({ content, type })
    }

    useEffect(() => {
        if (isErrorDelete) {
            toast.show("Erreur lors de la suppression", {
                type: "danger"
            })
            return
        }

        if (isSucessDelete && dataDelete) {
            toast.show(dataDelete.message, {
                type: dataDelete.success ? "success" : "warning"
            })
            router.push("/")
            queryClient.invalidateQueries({ queryKey: ["all"] })
        }

    }, [isErrorDelete, dataDelete, toast])

    useEffect(() => {
        if (isErrorEdit) {
            toast.show("Erreur lors de la mise à jour", {
                type: "danger"
            })
            return
        }

        if (isSuccessEdit && dataEdit) {
            toast.show(dataEdit.message, {
                type: dataEdit.success ? "success" : "warning"
            })
            queryClient.invalidateQueries({ queryKey: [`clipboard/${id}`] })
            queryClient.invalidateQueries({ queryKey: ["all"] })
            dismiss()
        }
    }, [isErrorEdit, dataEdit, toast])

    useEffect(() => {
        if (isErrorFavorite) {
            toast.show("Erreur lors de la mise en favori", {
                type: "danger"
            })
            return
        }

        if (isSuccessFavorite && dataFavorite?.success) {
            queryClient.invalidateQueries({ queryKey: ["all"] })
            queryClient.invalidateQueries({ queryKey: [`clipboard/${id}`] })
        }
    }, [isSuccessFavorite, dataFavorite, toast, isErrorFavorite])

    if (isError || (clipboardData && !clipboardData.success)) return <NotFound title="Aucun presse-papier trouvé" description="Cette donnée n'a pas été trouvée !" />

    return <SafeAreaView className="flex-1">
        {isPending && <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.tagSourceIconColor} />
        </View>}

        {data &&
            <>
                <CardPreviewHeader
                    mutate={() => favoriteMutate()}
                    favorite={data.isFavorite}
                    starDisabled={isPendingFavorite}
                />
                <View className="p-4 flex-1">
                    <View className="flex-1">
                        <View className="flex-row items-start gap-2">
                            <InfoType type={data.type} source={data.source} />
                        </View>
                        <View className="flex-row items-center gap-2 mt-5 mb-6">
                            <MaterialCommunityIcons
                                name="clock"
                                size={15}
                                style={{ opacity: .8 }}
                                color={colors.tagSourceIconColor}
                            />
                            <ThemedText className="text-sm opacity-80">
                                Crée le: {new Date(data.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} {new Date(data.createdAt).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </ThemedText>
                        </View>
                        <View>
                            <ScrollView
                                className="p-5 border rounded-2xl"
                                style={{
                                    borderColor: "#e2e8f0",
                                    height: 300
                                }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 40 }}
                            >
                                <ThemedText className="opacity-90 leading-8">
                                    {data.value}
                                </ThemedText>
                            </ScrollView>
                        </View>
                        <View
                            className="mt-6 border p-4 rounded-xl flex-row gap-4"
                            style={{
                                borderColor: colors.tagSourceBorderColor,
                                backgroundColor: colors.tagSourceBackground
                            }}
                        >
                            <Entypo name="info-with-circle" size={20} className="top-1" color={colors.tagSourceIconColor} />
                            <Text
                                style={{ color: colors.tagSourceColor }}
                                className="text-sm pr-6"
                            >
                                L'information a été automatiquement synchronisée avec votre ordinateur.
                                Il est disponible sur tout vos appareils mobiles connectés.
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="mb-6 p-4">
                    <Button
                        active
                        icon={<Feather name="copy" size={18} color={"#fff"} />}
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
                            className={`flex-row gap-2 items-center justify-center rounded-3xl py-3 px-8 w-[48%] ${isDark ? "bg-red-400/20" : "bg-red-500/20"} ${isPendingDelete && "opacity-15"}`}
                            activeOpacity={isPendingDelete ? .15 : 1}
                            onPress={handleDelete}
                            disabled={isPendingDelete}
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
                    actionButtonTitle={isPendingEdit ? "En cours..." : "Editer"}
                    handleAction={handleEditClipboard}
                    inputValue={data.value}
                    buttonDisabled={isPendingEdit}
                />
            </>
        }

    </SafeAreaView>
}

function InfoType({ type, source }: { type: Data["type"], source: Data["source"] }) {
    const { colors } = useThemeColor()

    return <NativeView className="flex-row gap-2">
        <NativeView
            style={{ borderColor: colors.tagSourceBorderColor, backgroundColor: colors.tagSourceBackground }}
            className="px-3 py-1 self-center rounded-3xl border"
        >
            <NativeView className="flex-row items-center gap-2">
                {
                    type === "CODE" ? <Feather name="code" size={12} color={colors.tagSourceIconColor} /> :
                        type === "URL" ? <Entypo name="link" size={12} color={colors.tagSourceIconColor} /> :
                            <Entypo name="text" size={12} color={colors.tagSourceIconColor} />
                }
                <Text
                    className="uppercase text-sm font-semibold tracking-wider"
                    style={{ color: colors.tagSourceColor }}>
                    {type}
                </Text>
            </NativeView>
        </NativeView>
        <NativeView
            style={{ borderColor: colors.tagSourceBorderColor, backgroundColor: colors.tagSourceBackground }}
            className="p-3 py-1 self-center rounded-2xl border"
        >
            <NativeView className="flex-row items-center gap-2">
                {
                    source === "PC" ?
                        <FontAwesome name="desktop" size={12} color={colors.tagSourceIconColor} />
                        : <Entypo name="mobile" size={12} color={colors.tagSourceIconColor} />
                }
                <Text
                    className="uppercase text-sm font-semibold tracking-wider"
                    style={{ color: colors.tagSourceColor }}>
                    {source}
                </Text>
            </NativeView>
        </NativeView>
    </NativeView>
}