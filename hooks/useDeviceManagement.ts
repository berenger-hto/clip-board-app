import { useState, useCallback, useEffect } from "react";
import { useToast } from "react-native-toast-notifications";
import { z } from "zod";
import * as Device from 'expo-device';
import { DefaultResponse, MobileDevice, OS } from "@/types/types";
import { useSQLite } from "@/hooks/useSQLite";
import { useSecureStore } from "@/hooks/useSecureStore";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useAppStore } from "@/hooks/useAppStore";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useSocketIO } from "./useSocketIO";
import { useQueryClient } from "@tanstack/react-query";

const clientDataSchema = z.object({
    ip: z.ipv4(),
    token: z.string(),
    expiresAt: z.number()
})

/**
 * Hook pour gérer la liste des appareils, le statut de l'appareil actuel et l'enregistrement de l'appareil.
 */
export function useDeviceManagement() {
    const toast = useToast()
    const { addDevice, getDevices, dbReady } = useSQLite()
    const { setValue } = useSecureStore()
    const [otherDevices, setOtherDevices] = useState<OS[] | null>(null)
    const [isCurrentDevice, setIsCurrentDevice] = useState<string | null>(null)
    const setIsRedirect = useAppStore(state => state.setIsRedirect)
    const { dismiss } = useBottomSheetModal()
    const { isConnected } = useSocketIO()
    const queryClient = useQueryClient()
    const setIp = useAppStore(state => state.setIp)
    const setToken = useAppStore(state => state.setToken)

    // Mutation pour enregistrer cet appareil auprès du serveur d'un autre appareil
    const { mutate, isSuccess, data: responseData } = useMutationQuery<MobileDevice, DefaultResponse & { os: OS }>("me", "POST", () => {
        toast.show("Connexion échouée !", { type: "danger" })
    })

    // Requête pour vérifier le statut de l'appareil actuel auprès du serveur connecté
    const { data: deviceData } = useFetchQuery<{ os: OS }>("device")

    const setTabActiveIndex = useAppStore(state => state.setTabActiveIndex)

    /**
     * Charge la liste des appareils enregistrés via SQLite.
     */
    const loadDevices = useCallback(async () => {
        const devices = await getDevices()
        setOtherDevices(devices && devices.length > 0 ? devices : null)
    }, [getDevices])

    // Charger les appareils quand la base de données est prête
    useEffect(() => {
        if (dbReady) {
            loadDevices()
        }
    }, [dbReady, loadDevices])

    // Mettre à jour le nom de l'appareil actuel à partir des données récupérées

    useEffect(() => {
        if (deviceData && deviceData.success) {
            setIsCurrentDevice(deviceData.os?.deviceName ?? null)
        }
    }, [deviceData])

    /**
     * Gère la réponse de l'enregistrement réussi.
     */
    useEffect(() => {
        if (isSuccess && responseData) {
            toast.show(responseData.message, {
                type: !responseData.success ? "warning" : "success"
            })

            if (responseData.success) {
                // Ajouter l'appareil à la DB locale et renvoyer sur le presse-papier
                addDevice(responseData.os.deviceName, responseData.os.username, responseData.os.platform)
                    .then(() => {
                        loadDevices()
                        setIsRedirect(true)
                        setTabActiveIndex(0)
                    })
            }
        }
    }, [isSuccess, responseData, addDevice, loadDevices, toast])

    /**
     * Invalider la req de device quand le statut de connexion change
     */

    useEffect(() => {
        if (!isConnected) return
        queryClient.invalidateQueries({ queryKey: ["device"] })
    }, [isConnected])

    /**
     * Valide et enregistre un appareil à partir des données QR scannées.
     */
    const registerScannedDevice = useCallback((qrData: string, onValid: () => void) => {
        try {
            const parsed = JSON.parse(qrData)
            const result = clientDataSchema.safeParse(parsed)

            if (!result.success) {
                toast.show("QR Code invalide", { type: "danger" })
                dismiss()
                return
            }

            // Sauvegarder les détails de connexion
            setValue("ip", result.data.ip)
            setValue("token", result.data.token)
            setIp(result.data.ip)
            setToken(result.data.token)

            // Déclencher la mutation d'enregistrement
            setTimeout(() => {
                mutate({
                    deviceName: Device.deviceName ?? "Unknown",
                    deviceOSName: Device.osName ?? "Unknown",
                    deviceOSVersion: Device.osVersion ?? "Unknown",
                    ...result.data
                })
            }, 300)

            onValid()
        } catch {
            toast.show("QR Code invalide", { type: "danger" })
            dismiss()
        }
    }, [mutate, setValue, toast])

    return {
        otherDevices,
        isCurrentDevice,
        registerScannedDevice,
        loadDevices,
        dbReady
    }
}
