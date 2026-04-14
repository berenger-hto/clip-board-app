import { ActivityIndicator } from "react-native"
import { useThemeColor } from "@/hooks/useThemeColor"
import { View } from "@/components/View"

export function Loader() {
    const { colors } = useThemeColor()
    
    return <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
    </View>
}