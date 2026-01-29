import {View} from "@/components/View";
import {Pressable} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import {ThemedText} from "@/components/ThemedText";
import {useRouter} from "expo-router";

export function Header() {
    const { isDark } = useThemeColor()
    const router = useRouter()

    return <View className={`flex-row items-center justify-between border-b p-4 ${isDark ? "border-[#333]" : "border-[#ccc]"}`}>
        <Pressable onPress={router.back}>
            <Entypo name="chevron-left" size={30} color={isDark ? "#94a3b8" : "#475569"} />
        </Pressable>
        <ThemedText className="!font-bold !text-2xl opacity-65">Informations</ThemedText>
        <Pressable className="border-blue-100 ">
            <FontAwesome name="star" size={24} color={isDark ? "#94a3b8" : "#475569"} />
        </Pressable>
    </View>
}

