import { View as NativeView, Text as NativeText } from "react-native";
import { ToastProps } from "react-native-toast-notifications/lib/typescript/toast";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = {
    toastOptions: ToastProps
}

export function ToastCard({ toastOptions }: Props) {
    const { message } = toastOptions
    const { isDark } = useThemeColor()

    return <NativeView
        style={{
            backgroundColor: isDark ? "rgba(255, 255, 255, .8)" : "rgba(48, 48, 48, .8)",
            alignSelf: "center",
            elevation: 2,
        }}
        className="px-5 py-2.5 rounded-xl flex-row gap-2 items-center justify-center m-4"
    >
        <NativeText
            style={{ color: isDark ? "#000" : "#fff" }}
            className="text-[12px] font-medium text-center">
            {message}
        </NativeText>
    </NativeView>
}