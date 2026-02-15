import { View } from "@/components/View";
import { ThemedText } from "@/components/ThemedText";
import { ScrollView, TouchableOpacity, View as NativeView } from "react-native"
import { Data, ClientData } from "@/types/types";
import Feather from '@expo/vector-icons/Feather';
import { useThemeColor } from "@/hooks/useThemeColor";
import { SyncColor } from "@/constants/Colors";
import React, { useRef, useCallback, useMemo, useState, useEffect } from "react";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useToast } from "react-native-toast-notifications";
import Ionicons from '@expo/vector-icons/Ionicons';
import { z } from "zod";
import { useMutationQuery } from "@/hooks/useMutationQuery";


type DeviceItemProps = {
    type: Data["source"]
    name: string
    statut: "Online" | "Offline"
}

const clientDataSchema = z.object({
    ip: z.ipv4(),
    token: z.string(),
    expiresAt: z.number()
})

export function Devices() {
    const { colors } = useThemeColor()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const toast = useToast()

    const [permission, requestPermission] = useCameraPermissions()
    const [scanned, setScanned] = useState(false)
    const [data, setData] = useState<ClientData | null>(null)
    const { dismiss } = useBottomSheetModal()
    const { mutate, isSuccess, isPending, data: mutationData } = useMutationQuery("v1/auth/me")

    const handleScan = (qrData: string) => {
        if (scanned) return
        setScanned(true)

        try {
            const parsed = JSON.parse(qrData)
            setData(parsed)
        } catch {
            setData(null)
            toast.show("QR Code invalide", {
                type: "danger"
            })
            dismiss()
        }

        setTimeout(() => {
            setScanned(false)
        }, 2000)
    }

    useEffect(() => {
        console.log("Time", Date.now())
        console.log("Current data", data)
        if (!data) return
        dismiss()
        const result = clientDataSchema.safeParse(data)

        if (!result.success) {
            toast.show("QR Code invalide", {
                type: "danger"
            })
            return
        }

        // appeler le serveur pour checker la data

        mutate(result.data)

    }, [data, dismiss])


    useEffect(() => {
        console.log("Is success", isSuccess)
        console.log("Mutation data", mutationData)
        if (isSuccess && mutationData) {
            toast.show(mutationData.message, {
                type: !mutationData.success ? "warning" : "success"
            })
        }
    }, [isPending, isSuccess])

    const handlePresentModalPress = useCallback(() => {
        if (!permission?.granted) {
            toast.show("Autorisez l'accès à votre camera", {
                type: "warning"
            })
            requestPermission()
            return
        }
        bottomSheetModalRef.current?.present()
    }, [permission?.granted, requestPermission, toast])

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
                style={{ backgroundColor: colors.background }}
            />
        ),
        [colors.background]
    )

    const snapPoints = useMemo(() => ['95%'], [])

    useEffect(() => {
        if (!permission) requestPermission()
    }, [permission, requestPermission])

    return <View style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between">
            <ThemedText className="text-3xl font-bold">
                Appareils
            </ThemedText>
            <TouchableOpacity activeOpacity={.7} onPress={handlePresentModalPress}>
                <View className="flex items-center justify-center h-10 w-10 rounded-full">
                    <Feather name="plus" size={24} color={colors.textPrimary} className="opacity-75" />
                </View>
            </TouchableOpacity>
        </View>
        <View className="mt-8">
            <ThemedText className="font-bold uppercase text-sm mb-4">Cet appareil</ThemedText>
            <DeviceItem type="Mobile" name="Tecno KL5" statut="Online" />
        </View>
        <View className="mt-8" style={{ flex: 1 }}>
            <ThemedText className="font-bold uppercase text-sm mb-4">Autre appareils</ThemedText>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36, gap: 12 }}>
                {Array.from({ length: 4 }).map((a, index) => (
                    <DeviceItem type="PC" name="HP EliteBook 1030 G2" statut="Offline" key={index} />
                ))}
            </ScrollView>
        </View>
        <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            keyboardBehavior="fillParent"
            enableDynamicSizing={false}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            handleIndicatorStyle={{
                backgroundColor: colors.primary,
                height: 8,
                width: 40
            }}
            backgroundStyle={{
                backgroundColor: colors.background
            }}
            index={0}
        >
            <BottomSheetView className="p-4" style={{ height: 730 }}>
                <View style={{ flex: 1 }}>
                    <ThemedText className="opacity-60 uppercase text-center text-sm font-bold -mt-2 mb-8">
                        Scannez le QR Code
                    </ThemedText>
                    <CameraView
                        style={{ flex: 1, borderRadius: 20 }}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"]
                        }}
                        onBarcodeScanned={scanned ? undefined : ({ data }) => handleScan(data)}
                    />
                    <Ionicons
                        name="scan-outline"
                        size={300}
                        style={{
                            position: "absolute",
                            top: 210,
                            left: 18,
                            opacity: .7
                        }}
                        color={colors.primary}
                    />
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    </View>
}

function DeviceItem({ type, name, statut }: DeviceItemProps) {
    const { colors } = useThemeColor()
    const iconName = type === "Mobile" ? "smartphone" : "monitor"
    const isOnline = statut === "Online"
    return <TouchableOpacity
        style={{
            borderColor: isOnline ? colors.tagSourceBorderColor : "",
            borderWidth: isOnline ? 3 : 0,
            backgroundColor: colors.box
        }}
        activeOpacity={isOnline ? 1 : .7}
        className="p-4 rounded-3xl"
    >
        <NativeView className="flex-row items-center gap-4">
            <NativeView
                style={{ backgroundColor: colors.background }}
                className="rounded-xl h-14 w-14 items-center justify-center"
            >
                <Feather name={iconName} size={24} color={colors.textPrimary} className="opacity-50" />
            </NativeView>
            <NativeView>
                <ThemedText className="font-bold text-lg opacity-80">{name}</ThemedText>
                <ThemedText
                    className="text-sm font-semibold"
                    style={{ color: isOnline ? SyncColor["OK"] : SyncColor["NO"] }}
                >
                    {isOnline ? "En ligne" : "Déconnecté"}
                </ThemedText>
            </NativeView>
        </NativeView>
    </TouchableOpacity>
}