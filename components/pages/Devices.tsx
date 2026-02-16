import { View } from "@/components/View";
import { ThemedText } from "@/components/ThemedText";
import { ScrollView, TouchableOpacity, View as NativeView } from "react-native"
import { Data, ClientData, OS } from "@/types/types";
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
import { useSQLite } from "@/hooks/useSQLite";
import { useSecureStore } from "@/hooks/useSecureStore";
import * as Device from 'expo-device'
import { useFetchQuery } from "@/hooks/useFetchQuery";


type DeviceItemProps = {
    type: Data["source"]
    name: string
    statut: "Online" | "Offline" | undefined
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
    const [isCurrentDevice, setIsCurrentDevice] = useState<string | null>(null)
    const { dismiss } = useBottomSheetModal()
    const { mutate, isSuccess, isPending, data: responseData } = useMutationQuery("v1/me", () => {
        toast.show("Connexion échouée !", {
            type: "danger"
        })
    })

    const [otherDevices, setOtherDevices] = useState<OS[] | null>(null)

    const { data: deviceData } = useFetchQuery("v1/device")

    const { addDevice, getDevices, dbReady } = useSQLite()
    const { setValue } = useSecureStore()

    const loadDevices = useCallback(async () => {
        const devices = await getDevices()
        if (devices) {
            setOtherDevices(devices)
        }
    }, [getDevices])

    useEffect(() => {
        if (dbReady) {
            loadDevices()
        }
    }, [dbReady, loadDevices])

    useEffect(() => {
        console.log("Device data", deviceData)
        if (deviceData) {
            setIsCurrentDevice(deviceData.os.deviceName ?? null)
        }
    }, [deviceData])


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

        mutate(
            {
                deviceName: Device.deviceName ?? "Unknown",
                deviceOSName: Device.osName ?? "Unknown",
                deviceOSVersion: Device.osVersion ?? "Unknown",
                ...result.data
            }
        )

    }, [data, dismiss])

    useEffect(() => {
        console.log("Is success", isSuccess)
        console.log("Mutation data", responseData)
        if (isSuccess && responseData) {
            toast.show(responseData.message, {
                type: !responseData.success ? "warning" : "success"
            })

            if (responseData.success) {
                addDevice(responseData.os.deviceName, responseData.os.username, responseData.os.platform)
                    .then(() => {
                        loadDevices()
                    })
                setValue("ip", data?.ip ?? "")
                setValue("token", data?.token ?? "")
            }
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
            <DeviceItem type="Mobile" name={Device.deviceName ?? "Unknown"} statut="Online" />
        </View>
        <View className="mt-8" style={{ flex: 1 }}>
            <ThemedText className="font-bold uppercase text-sm mb-4">Autre appareils</ThemedText>
            {otherDevices && <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36, gap: 12 }}>
                {otherDevices?.map((device, index) => (
                    <DeviceItem
                        type="PC"
                        name={device.deviceName ?? "Unknown"}
                        statut={isCurrentDevice === device.deviceName ? "Online" : "Offline"}
                        key={index}
                    />
                ))}
            </ScrollView>}
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
                {statut && <ThemedText
                    className="text-sm font-semibold"
                    style={{ color: isOnline ? SyncColor["OK"] : SyncColor["NO"] }}
                >
                    {isOnline ? "En ligne" : "Déconnecté"}
                </ThemedText>}
            </NativeView>
        </NativeView>
    </TouchableOpacity>
}