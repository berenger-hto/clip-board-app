import { ThemedText } from "@/components/ThemedText";
import { View as NativeView } from "react-native";
import { ToastProps } from "react-native-toast-notifications/lib/typescript/toast";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = {
    toastOptions: ToastProps
}

export function ToastCard({ toastOptions }: Props) {
    const { colors, isDark } = useThemeColor()
    const { message } = toastOptions

    return (
        <NativeView
            style={{
                backgroundColor: colors.box,
                borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                borderWidth: 1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0.4 : 0.1,
                shadowRadius: 10,
                elevation: 4,
            }}
            className="px-6 py-3.5 rounded-2xl items-center justify-center min-w-[140px] m-2"
        >
            <ThemedText className="text-[15px] font-semibold text-center leading-5">{message}</ThemedText>
        </NativeView>
    )
}