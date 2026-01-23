import {Color} from "@/constants/Color";
import {useColorScheme} from "react-native";

export function useTheme() {
    const colorScheme = useColorScheme() ?? "light"
    return colorScheme === "dark" ?
        { ...Color["dark"] } :
        { ...Color["light"] }
}