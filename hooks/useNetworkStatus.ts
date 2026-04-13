import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export function useNetworkStatus() {
    const [isWifi, setIsWifi] = useState(false)

    useEffect(() => {
        const updateState = (state: any) => {
            setIsWifi(state.type === "wifi" && !!state.isConnected)
        }

        NetInfo.fetch().then(updateState)
        
        const unsubscribe = NetInfo.addEventListener(updateState)

        return () => unsubscribe()
    }, [])

    return isWifi
}