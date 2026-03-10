import { View } from "@/components/View";
import { ThemedText } from "@/components/ThemedText";
import { ScrollView, TouchableOpacity, View as NativeView } from "react-native"
import { Data } from "@/types/types";
import Feather from '@expo/vector-icons/Feather';
import { useThemeColor } from "@/hooks/useThemeColor";
import { SyncColor } from "@/constants/Colors";
import React, { useRef, useCallback, useMemo, useEffect } from "react";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { CameraView } from "expo-camera";
import { useToast } from "react-native-toast-notifications";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Device from 'expo-device'
import { useScanner } from "@/hooks/useScanner";
import { useDeviceManagement } from "@/hooks/useDeviceManagement";
import { useSocketIO } from "@/hooks/useSocketIO";

/**
 * Propriétés pour le composant DeviceItem.
 */
type DeviceItemProps = {
    type: Data["source"]
    name: string
    statut?: "Online" | "Offline"
    noBorder?: boolean
}

/**
 * Page principale pour la gestion des appareils connectés.
 * Affiche l'appareil actuel et une liste des autres appareils connus.
 * Permet d'ajouter de nouveaux appareils via le scan de QR code.
 */
export function Devices() {
    const { colors } = useThemeColor()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const toast = useToast()
    const { dismiss } = useBottomSheetModal()
    const { isConnected } = useSocketIO()

    // Hooks personnalisés pour la séparation de la logique
    const { permission, requestPermission, handleScan } = useScanner()
    const { otherDevices, isCurrentDevice, registerScannedDevice } = useDeviceManagement()

    /**
     * Ouvre le modal du scanner QR.
     * Vérifie d'abord les permissions de la caméra.
     */
    const handlePresentModalPress = useCallback(() => {
        if (!permission?.granted) {
            toast.show("Autorisez l'accès à votre camera", { type: "warning" })
            requestPermission()
            return
        }
        bottomSheetModalRef.current?.present()
    }, [permission?.granted, requestPermission, toast])

    /**
     * Rendu de l'arrière-plan pour le BottomSheetModal.
     */
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
        console.log("Other device", otherDevices)
    }, [otherDevices])

    return (
        <View style={{ flex: 1 }}>
            {/* Section d'en-tête avec le Titre et le bouton Ajouter */}
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

            {/* Section Appareil actuel */}
            <View className="mt-8">
                <ThemedText className="font-bold uppercase text-sm mb-4">Cet appareil</ThemedText>
                <DeviceItem type="Mobile" name={Device.deviceName ?? "Unknown"} statut="Online" />
            </View>

            {/* Section Liste des autres appareils */}
            <View className="mt-8" style={{ flex: 1 }}>
                <ThemedText className="font-bold uppercase text-sm mb-4">Autre appareils</ThemedText>
                {otherDevices ? (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36, gap: 12 }}>
                        {otherDevices.map((device, index) => (
                            <DeviceItem
                                type="PC"
                                name={device.deviceName ?? "Unknown"}
                                statut={(isConnected && isCurrentDevice === device.deviceName) ? "Online" : "Offline"}
                                noBorder
                                key={index}
                            />
                        ))}
                    </ScrollView>
                ) : <ThemedText className="text-center opacity-80 font-bold uppercase text-[12px] mt-5">Aucun appareil connecté</ThemedText>}
            </View>

            {/* Modal du scanner QR */}
            <BottomSheetModal
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                keyboardBehavior="fillParent"
                enableDynamicSizing={false}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
                handleIndicatorStyle={{
                    backgroundColor: colors.bottomSheetIndicatorColor,
                    height: 5,
                    width: 36,
                    borderRadius: 10
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
                            onBarcodeScanned={handleScan((data) => registerScannedDevice(data, dismiss))}
                        />
                        <Ionicons
                            name="scan-outline"
                            size={300}
                            style={{
                                flex: 1,
                                justifyContent: "center",   
                                alignItems: "center",
                                opacity: .7,
                                position: "absolute",
                                top: 210,
                                left: 18
                            }}
                            color={colors.bottomSheetIndicatorColor}
                        />
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    )
}

/**
 * Composant pour afficher un seul élément d'appareil dans la liste.
 */
function DeviceItem({ type, name, statut, noBorder }: DeviceItemProps) {
    const { colors } = useThemeColor()
    const iconName = type === "Mobile" ? "smartphone" : "monitor"
    const isOnline = statut === "Online"

    return (
        <TouchableOpacity
            style={{
                borderColor: isOnline ? colors.tagSourceBorderColor : "",
                borderWidth: (isOnline && !noBorder) ? 2 : 0,
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
                    {statut && (
                        <ThemedText
                            className="text-sm font-semibold"
                            style={{ color: isOnline ? SyncColor["OK"] : SyncColor["NO"] }}
                        >
                            {isOnline ? "En ligne" : "Déconnecté"}
                        </ThemedText>
                    )}
                </NativeView>
            </NativeView>
        </TouchableOpacity>
    )
}