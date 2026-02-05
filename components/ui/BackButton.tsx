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

    const handleGoBackFunction = () => {
        if (router.canGoBack()) {
            router.back()
        } else {
            router.replace("/")
        }
    }

    return <Pressable onPress={handleGoBack ? handleGoBack : handleGoBackFunction}>
        <Entypo name="chevron-left" size={30} color={isDark ? "#94a3b8" : "#475569"} />
    </Pressable>
}