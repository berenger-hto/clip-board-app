import {ThemedText} from "@/components/ThemedText";
import {Button} from "@/components/forms/Button";
import {SafeAreaView} from "@/components/SafeAreaView";
import {useRouter} from "expo-router";
import {Image} from "expo-image";
import {useThemeColor} from "@/hooks/useThemeColor";
import {View} from "@/components/View"

type Props = {
    title?: string,
    description?: string
    handleGoBack?: () => void
}

export function NotFound({ title, description, handleGoBack }: Props) {
    const router = useRouter()
    const { colors } = useThemeColor()

    return <SafeAreaView className="flex-1 items-center justify-center">
        <Image
            source={require("@/assets/images/404-not-found.png")}
            style={{width: 150, height: 150}}
            contentFit={"contain"}
            transition={400}
        />
        <View className="mt-4 gap-3">
            <ThemedText className="text-2xl font-bold text-center">{title ? title : "Oops !"}</ThemedText>
            <ThemedText className="text-center font-xl" style={{color: colors.tagSourceColor}}>
                {description ? description : "Cette donnée n'existe plus dans le presse-papier."}
            </ThemedText>
            <Button active onPress={handleGoBack ? handleGoBack : () => router.push("/")}>Retour</Button>
        </View>
    </SafeAreaView>
}