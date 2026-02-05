import {Stack} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";

export default function RootLayout() {
    return <SafeAreaProvider>
        <Stack screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 200, // Pour que ce soit plus rapide et nerveux
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="card/[id]"
                options={{
                    animation: 'fade_from_bottom', // Animation spécifique pour cet écran
                    presentation: 'modal'
                }}
            />
        </Stack>
    </SafeAreaProvider>
}
