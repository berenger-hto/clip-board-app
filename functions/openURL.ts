import {Alert, Linking} from "react-native";

export async function openURL(url: string) {
    try {
        const supported = await Linking.canOpenURL(url)
        if (supported) {
            await Linking.openURL(url)
        } else {
            Alert.alert("Lien invalide", `Impossible d'ouvrir l'URL : ${url}`)
        }
    } catch (e) {
        const error = (e as Error).toString()
        Alert.alert("Error", error)
    }
}