import { SafeAreaView } from "@/components/SafeAreaView"
import { ThemedText } from "@/components/ThemedText"
import { View } from "@/components/View"
import { useHandleGoBack } from "@/hooks/useHandleGoBack"
import { useThemeColor } from "@/hooks/useThemeColor"
import Feather from "@expo/vector-icons/Feather"
import { ScrollView, TouchableOpacity } from "react-native"

export default function About() {
    const { colors } = useThemeColor()
    const handleGoBack = useHandleGoBack()

    return <SafeAreaView className="flex-1">
        <View className="mt-4 px-4">
            
            <TouchableOpacity className="flex-row items-center gap-2 pb-4" activeOpacity={.8} onPress={handleGoBack}>
                <Feather name="chevron-left" size={24} color={colors.textPrimary} />
                <ThemedText className="text-base font-bold">A propos</ThemedText>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                <ThemedText className="text-xl font-bold text-center mb-4">
                    ClipboardX v1.0
                </ThemedText>

                <ThemedText className="mb-4 text-center">
                    ClipboardX est une application conçue pour sauvegarder, organiser et synchroniser tout ce que tu copies, simplement et efficacement.
                </ThemedText>

                <ThemedText className="font-bold mt-4 mb-2">
                    Fonctionnement
                </ThemedText>

                <ThemedText className="mb-3">
                    ClipboardX enregistre automatiquement les éléments que tu copies afin de te permettre de les retrouver facilement plus tard. Selon les fonctionnalités activées, certaines données peuvent être synchronisées entre tes appareils.
                </ThemedText>

                <ThemedText className="font-bold mt-4 mb-2">
                    Données et confidentialité
                </ThemedText>

                <ThemedText className="mb-3">
                    Les données copiées peuvent inclure du texte ou d'autres informations sensibles. ClipboardX s'efforce de protéger ces données, mais il est recommandé de ne pas copier d'informations confidentielles si tu ne souhaites pas qu'elles soient sauvegardées.
                </ThemedText>

                <ThemedText className="mb-3">
                    En utilisant l'application, tu acceptes que certaines données soient stockées localement et, si activé, synchronisées via des services sécurisés.
                </ThemedText>

                <ThemedText className="font-bold mt-4 mb-2">
                    Responsabilité
                </ThemedText>

                <ThemedText className="mb-3">
                    ClipboardX est fourni tel quel. L'utilisation de l'application se fait sous ta responsabilité. L'équipe ne peut être tenue responsable de toute perte de données ou utilisation non prévue.
                </ThemedText>

                <ThemedText className="font-bold mt-4 mb-2">
                    Conditions d'utilisation
                </ThemedText>

                <ThemedText className="mb-3">
                    En utilisant ClipboardX, tu acceptes les présentes conditions. Celles-ci peuvent être mises à jour à tout moment afin d'améliorer le service.
                </ThemedText>

                <ThemedText className="mb-6">
                    Pour toute question ou suggestion, n'hésite pas à nous contacter.
                </ThemedText>
            </ScrollView>
        </View>
    </SafeAreaView>
}