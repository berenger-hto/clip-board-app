import * as SQLite from 'expo-sqlite';
import { useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
import { OS } from '@/types/types';

export function useSQLite() {
    const db = SQLite.useSQLiteContext()
    const toast = useToast()

    const getDevices = useCallback(async () => {
        try {
            const result = await db.getAllAsync<OS & { createdAt: string, id: number }>('SELECT * FROM devices')
            console.log("Result", result)
            return result
        } catch (e) {
            console.error(e)
            toast.show("Echec: Récupération des appareils", {
                type: "danger"
            })
            return null
        }
    }, [db, toast])

    const findDevice = useCallback(async (deviceName: string | undefined, username: string | undefined, platform: string | undefined) => {
        if (!deviceName || !username || !platform) return
        try {
            const result = await db.getFirstAsync<OS & { createdAt: string, id: number }>('SELECT * FROM devices WHERE deviceName = $deviceName AND username = $username AND platform = $platform', {
                $deviceName: deviceName,
                $username: username,
                $platform: platform
            })
            console.log("Result", result)
            return result
        } catch (e) {
            console.error(e)
            toast.show("Echec: Récupération des appareils", {
                type: "danger"
            })
            return null
        }
    }, [db, toast])

    const addDevice = useCallback(async (deviceName: string | undefined, username: string | undefined, platform: string | undefined) => {
        if (!deviceName || !username || !platform) return
        const device = await findDevice(deviceName, username, platform)
        if (device) return

        const statement = await db.prepareAsync(
            'INSERT INTO devices (deviceName, username, platform, createdAt) VALUES ($deviceName, $username, $platform, $createdAt)'
        )

        try {
            let result = await statement.executeAsync({ $deviceName: deviceName, $username: username, $platform: platform, $createdAt: Math.floor(Date.now() / 1000) });
            console.log(result)
        } catch (e) {
            console.error(e)
            toast.show("Echec: Ajout de l'appareil", {
                type: "danger"
            })
        } finally {
            await statement.finalizeAsync()
        }
    }, [db, findDevice, toast])

    const addToClipboard = useCallback(async (content: string) => {
        const statement = await db.prepareAsync(
            'INSERT INTO clipboard (content, createdAt) VALUES ($content, $createdAt)'
        )

        try {
            let result = await statement.executeAsync({ $content: content, $createdAt: Math.floor(Date.now() / 1000) });
            console.log(result)
        } catch (e) {
            console.error(e)
            toast.show("Echec: Ajout du contenu", {
                type: "danger"
            })
        } finally {
            await statement.finalizeAsync()
        }
    }, [db, toast])

    return { addDevice, getDevices, dbReady: true }
}