import Entypo from "@expo/vector-icons/Entypo";
import {Pressable} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { useHandleGoBack } from "@/hooks/useHandleGoBack";

type Props = {
    handleGoBack?: () => void
    size?: number
}

export function BackButton({ handleGoBack, size = 30 }: Props) {
    const { isDark } = useThemeColor()

    const handleGoBackFn = useHandleGoBack()

    return <Pressable onPress={handleGoBack ? handleGoBack : handleGoBackFn}>
        <Entypo name="chevron-left" size={size} color={isDark ? "#94a3b8" : "#475569"} />
    </Pressable>
}