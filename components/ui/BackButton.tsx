import Entypo from "@expo/vector-icons/Entypo";
import {Pressable} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import { router } from "expo-router";

type Props = {
    handleGoBack?: () => void
    size?: number
}

export function BackButton({ handleGoBack, size = 30 }: Props) {
    const { isDark } = useThemeColor()

    const handleGoBackFn = () => {
        if (router.canGoBack()) {
            router.back()
            return
        }
        router.push("/")
    }

    return <Pressable onPress={handleGoBack ? handleGoBack : handleGoBackFn}>
        <Entypo name="chevron-left" size={size} color={isDark ? "#94a3b8" : "#475569"} />
    </Pressable>
}