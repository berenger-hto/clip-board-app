import {setStringAsync} from "expo-clipboard";
import {Alert} from "react-native";

export async function addToClipboard(value: string) {
    try {
        await setStringAsync(value)
    } catch (e) {
        const error = (e as Error).toString()
        Alert.alert("Error !", error)
    }
}