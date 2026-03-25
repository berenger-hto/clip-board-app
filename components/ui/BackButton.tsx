import Entypo from "@expo/vector-icons/Entypo";
import {Pressable} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import {useRouter} from "expo-router";

type Props = {
    handleGoBack?: () => void
}

export function BackButton({ handleGoBack }: Props) {
    const { isDark } = useThemeColor()
    const router = useRouter()

    const handleGoBackFn = () => {
        if (router.canGoBack()) {
            router.back()
            return
        }
        router.push("/")
    }

    return <Pressable onPress={handleGoBack ? handleGoBack : handleGoBackFn}>
        <Entypo name="chevron-left" size={30} color={isDark ? "#94a3b8" : "#475569"} />
    </Pressable>
}