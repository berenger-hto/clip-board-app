import {Colors} from "@/constants/Colors";
import {useColorScheme} from "react-native";

export function useThemeColor() {
    const colorScheme = useColorScheme() ?? "dark"
    return {
        colors: colorScheme === "dark" ? {...Colors["dark"]} : {...Colors["light"]},
        isDark: colorScheme === "dark"
    }
}