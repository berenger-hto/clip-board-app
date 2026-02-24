import { Colors } from "@/constants/Colors";
import { useAppStore } from "@/hooks/useAppStore";
import { useColorScheme } from "react-native";

export function useThemeColor() {
    const appTheme = useAppStore(state => state.appTheme)
    const colorScheme = useColorScheme() ?? "dark"

    return {
        colors: Colors[appTheme ?? colorScheme],
        isDark: appTheme ? appTheme === "dark" : colorScheme === "dark"
    }
}