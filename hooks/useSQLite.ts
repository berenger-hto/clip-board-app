import * as SQLite from 'expo-sqlite';
import React, { useEffect, useState, useCallback } from 'react';
import { useToast } from 'react-native-toast-notifications';
import { OS } from '@/types/types';

export function useSQLite() {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null)
    const [dbReady, setDbReady] = useState(false)
    const toast = useToast()

    useEffect(() => {
        async function setup() {
            try {
                const database = await SQLite.openDatabaseAsync("clipboard.db")

                await database.execAsync(`
                    PRAGMA journal_mode = WAL;
                    CREATE TABLE IF NOT EXISTS devices (
                        id INTEGER PRIMARY KEY NOT NULL, 
                        deviceName TEXT NOT NULL, 
                        username TEXT NOT NULL,
                        platform TEXT DEFAULT 'TEXT',
                        createdAt BIGINT
                    );

                    CREATE TABLE IF NOT EXISTS history (
                        id INTEGER PRIMARY KEY NOT NULL,
                        value TEXT NOT NULL,
                        type TEXT NOT NULL,
                        source TEXT NOT NULL,
                        createdAt BIGINT
                    );
                `)

                setDb(database)
                setDbReady(true)
            } catch (error) {
                console.error("Erreur SQLite :", error)
                toast.show("Base de donnée inconnue", {
                    type: "danger"
                })
            }
        }

        setup()
    }, [])

    const getDevices = useCallback(async () => {
        if (!db) return [];
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
        if (!deviceName || !username || !platform || !db) return
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

    return { addDevice, getDevices, dbReady }
}