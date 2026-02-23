import {Colors} from "@/constants/Colors";
import { useAppStore } from "@/store";
import { useEffect } from "react";
import {useColorScheme} from "react-native";

export function useThemeColor() {
    const appTheme = useAppStore(state => state.appTheme)
    const setAppTheme = useAppStore(state => state.setAppTheme)
    const colorScheme = useColorScheme() ?? "dark"
    useEffect(() => {
        setAppTheme(colorScheme)
    }, [colorScheme])

    return {
        colors: Colors[appTheme],
        isDark: appTheme === "dark",
    }
}