import { useState, useCallback, useEffect } from "react";
import { useCameraPermissions } from "expo-camera";
import { useToast } from "react-native-toast-notifications";

/**
 * Hook pour gérer les permissions de la caméra et l'état du scan de QR code.
 */
export function useScanner() {
    const [permission, requestPermission] = useCameraPermissions()
    const [scanned, setScanned] = useState(false)
    const toast = useToast()

    // Demander la permission au montage si elle n'est pas déjà accordée
    useEffect(() => {
        if (!permission) requestPermission()
    }, [permission, requestPermission])

    /**
     * Gère le scan d'un code-barres.
     * Empêche les scans multiples en utilisant l'état 'scanned'.
     */
    const handleScan = useCallback((callback: (data: string) => void) => ({ data }: { data: string }) => {
        if (scanned) return
        setScanned(true)

        callback(data)

        // Réinitialiser l'état scanned après 2 secondes pour permettre de scanner à nouveau
        setTimeout(() => {
            setScanned(false)
        }, 2000)
    }, [scanned])

    return {
        permission,
        requestPermission,
        scanned,
        handleScan,
    }
}
