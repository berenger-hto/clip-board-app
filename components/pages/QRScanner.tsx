import { useState, useEffect } from "react"
import { View, Text } from "react-native"
import { CameraView, useCameraPermissions } from "expo-camera"

export default function QRScanner() {
    const [permission, requestPermission] = useCameraPermissions()
    const [scanned, setScanned] = useState(false)
    const [data, setData] = useState<string | null>(null)

    useEffect(() => {
        if (!permission) requestPermission()
    }, [])

    if (!permission?.granted) {
        return <Text>Permission caméra requise</Text>
    }

    return (
        <View style={{ flex: 1 }}>
            <CameraView
                style={{ flex: 1 }}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"]
                }}
                onBarcodeScanned={({ data }) => {
                    if (!scanned) {
                        setScanned(true)
                        setData(data)
                        console.log("QR data:", data)
                    }
                }}
            />
        </View>
    )
}
