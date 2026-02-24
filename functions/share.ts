import { Share, Alert } from "react-native"

export async function share(item: string) {
    try {
        await Share.share({
            title: "Partager le contenu",
            message: item
        })
    } catch (error) {
        Alert.alert("Erreur de partage", "Le partage n'a pas pu être effectué")
        console.error(error)
    }
}