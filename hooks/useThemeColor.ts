import {Color} from "@/constants/Color";
import {useColorScheme} from "react-native";

export function useThemeColor() {
    const colorScheme = useColorScheme() ?? "dark"
    return {
        colors: colorScheme === "dark" ? {...Color["dark"]} : {...Color["light"]},
        isDark: colorScheme === "dark"
    }
}