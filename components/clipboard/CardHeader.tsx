import { View } from "@/components/View";
import { Pressable } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemedText } from "@/components/ThemedText";
import { BackButton } from "@/components/ui/BackButton";

type Props = {
    mutate: () => void
    favorite: boolean
    starDisabled: boolean
}

export function CardHeader({ mutate, favorite, starDisabled }: Props) {
    const { isDark } = useThemeColor()
    const color = favorite ? "#ffd700" : isDark ? "#94a3b8" : "#475569"

    return <View className={`flex-row items-center justify-between border-b p-4 ${isDark ? "border-[#333]" : "border-[#ccc]"}`}>
        <BackButton />
        <ThemedText className="!font-bold !text-2xl opacity-65">Détails</ThemedText>
        <Pressable style={{ opacity: starDisabled ? .8 : 1 }} disabled={starDisabled} onPress={() => mutate()}>
            <FontAwesome name="star" size={24} color={color} />
        </Pressable>
    </View>
}

