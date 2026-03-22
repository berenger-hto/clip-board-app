import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ToastProvider } from "react-native-toast-notifications";
import { ToastCard } from "@/components/ui/ToastCard";
import { ToastQueueManager } from "@/hooks/useToast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { useSecureStore } from "@/hooks/useSecureStore";
import { useColorScheme } from "react-native";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import type { Data } from "@/types/types";
import { useSocketIO } from "@/hooks/useSocketIO";

const queryClient = new QueryClient()

async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY NOT NULL, 
            deviceName TEXT NOT NULL, 
            username TEXT NOT NULL,
            platform TEXT DEFAULT 'TEXT',
            createdAt BIGINT
        );
    `)
}

function InitializeApp() {
    const setIp = useAppStore(state => state.setIp)
    const setToken = useAppStore(state => state.setToken)
    const setAppTheme = useAppStore(state => state.setAppTheme)
    const setData = useAppStore(state => state.setData)
    const { getValue } = useSecureStore()
    const colorScheme = useColorScheme() ?? "dark"
    const [enabled, setEnabled] = useState(false)
    const { data: allData, isSuccess } = useFetchQuery<{ data: Data[] }>("all", undefined, { enabled })
    const { isConnected } = useSocketIO()

    useEffect(() => {
        const load = async () => {
            try {
                const savedIp = await getValue("ip")
                const savedToken = await getValue("token")
                setIp(savedIp)
                setToken(savedToken)
                setAppTheme(colorScheme)
                setEnabled(true)
            } catch (error) {
                console.error("Erreur lors de l'initialisation du store:", error)
            }
        }
        load()
    }, [colorScheme])

    useEffect(() => {
        console.log("Is exec", isSuccess)
        if (!isSuccess || !allData.success) {
            return
        }
        setData(allData.data)
    }, [isSuccess, allData])

    useEffect(() => {
        if (!isConnected) return
        queryClient.invalidateQueries({ queryKey: ["all"] })
    }, [isConnected])

    return null
}

export default function RootLayout() {
    return <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
            <ToastProvider
                placement="bottom"
                duration={4000}
                animationType='slide-in'
                animationDuration={100}
                offset={30}
                offsetTop={0}
                offsetBottom={100}
                swipeEnabled={true}
                renderToast={(toastOptions) => <ToastCard toastOptions={toastOptions} />}
            >
                <ToastQueueManager />
                <GestureHandlerRootView style={{ flex: 1, backgroundColor: "transparent" }}>
                    <BottomSheetModalProvider>
                        <SQLite.SQLiteProvider databaseName="clipboard.db" onInit={migrateDbIfNeeded}>
                            <InitializeApp />
                            <Stack screenOptions={{
                                headerShown: false,
                                animation: 'slide_from_right',
                                animationDuration: 200,
                            }}>
                                <Stack.Screen name="index" />
                                <Stack.Screen
                                    name="clipboard/[id]"
                                    options={{
                                        animation: 'fade_from_bottom',
                                        presentation: 'modal'
                                    }}
                                />
                            </Stack>
                        </SQLite.SQLiteProvider>
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </ToastProvider>
        </QueryClientProvider>
    </SafeAreaProvider>
}
