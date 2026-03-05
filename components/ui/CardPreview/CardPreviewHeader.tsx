import {View} from "@/components/View";
import {Pressable} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {ThemedText} from "@/components/ThemedText";
import {BackButton} from "@/components/ui/BackButton";

type Props = {
    mutate: () => void
}

export function CardPreviewHeader({ mutate }: Props) {
    const { isDark } = useThemeColor()

    return <View className={`flex-row items-center justify-between border-b p-4 ${isDark ? "border-[#333]" : "border-[#ccc]"}`}>
        <BackButton />
        <ThemedText className="!font-bold !text-2xl opacity-65">Détails</ThemedText>
        <Pressable className="border-blue-100" onPress={() => mutate()}>
            <FontAwesome name="star" size={24} color={isDark ? "#94a3b8" : "#475569"} />
        </Pressable>
    </View>
}

