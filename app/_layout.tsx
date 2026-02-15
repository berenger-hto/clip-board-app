import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ToastProvider } from "react-native-toast-notifications";
import { ToastCard } from "@/components/ui/ToastCard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function RootLayout() {
    return <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
            <ToastProvider
                placement="top"
                duration={5000}
                animationType='slide-in'
                animationDuration={250}
                offset={30}
                offsetTop={60}
                offsetBottom={40}
                swipeEnabled={true}
                renderToast={(toastOptions) => <ToastCard toastOptions={toastOptions} />}
            >
                <GestureHandlerRootView style={{ flex: 1, backgroundColor: "transparent" }}>
                    <BottomSheetModalProvider>
                        <Stack screenOptions={{
                            headerShown: false,
                            animation: 'slide_from_right',
                            animationDuration: 200,
                        }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen
                                name="card/[id]"
                                options={{
                                    animation: 'fade_from_bottom',
                                    presentation: 'modal'
                                }}
                            />
                        </Stack>
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </ToastProvider>
        </QueryClientProvider>
    </SafeAreaProvider>
}
