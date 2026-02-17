import * as SQLite from 'expo-sqlite';
import { useCallback } from 'react';
import { useToast } from 'react-native-toast-notifications';
import { OS } from '@/types/types';

export function useSQLite() {
    const db = SQLite.useSQLiteContext();
    const toast = useToast()

    const getDevices = useCallback(async () => {
        try {
            const result = await db.getAllAsync<OS & { createdAt: string, id: number }>('SELECT * FROM devices')
            console.log("Result", result)
            return result
        } catch (e) {
            console.error(e)
            toast.show("Echec de récupération des appareils", {
                type: "danger"
            })
            return [];
        }
    }, [db, toast])

    const addDevice = useCallback(async (deviceName: string | undefined, username: string | undefined, platform: string | undefined) => {
        if (!deviceName || !username || !platform) return
        const devices = await getDevices()
        if (devices) {
            const exist = devices.find(os => os.username === username && os.platform === platform && os.deviceName === deviceName)
            if (exist) return
        }

        const statement = await db.prepareAsync(
            'INSERT INTO devices (deviceName, username, platform, createdAt) VALUES ($deviceName, $username, $platform, $createdAt)'
        )

        try {
            let result = await statement.executeAsync({ $deviceName: deviceName, $username: username, $platform: platform, $createdAt: Math.floor(Date.now() / 1000) });
            console.log(result)
        } catch (e) {
            console.error(e)
            toast.show("Echec d'ajout de l'appareil", {
                type: "danger"
            })
        } finally {
            await statement.finalizeAsync()
        }
    }, [db, getDevices, toast])

    return { addDevice, getDevices, dbReady: true }
}