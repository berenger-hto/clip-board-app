import { View as NativeView, Text as NativeText } from "react-native";
import { ToastProps } from "react-native-toast-notifications/lib/typescript/toast";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image } from "expo-image";

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
        className="px-5 py-2.5 rounded-full flex-row gap-2 items-center justify-center m-4"
    >
        <Image
            source={isDark ? require("@/assets/images/toast-icon-dark.png") : require("@/assets/images/toast-icon.png")}
            style={{ width: 18, height: 18 }}
        />
        <NativeText
            style={{ color: isDark ? "#000" : "#fff" }}
            className="text-[14px] font-medium text-center">
            {message}
        </NativeText>
    </NativeView>
}