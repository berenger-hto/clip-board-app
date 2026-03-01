import * as Clipboard from "expo-clipboard"
import { useCallback } from "react";
import { Alert } from "react-native";
import { useAudioPlayer } from 'expo-audio';
import { useAppStore } from "./useAppStore";

const audioSourceCopy = require("@/assets/sounds/copy.wav")
const audioSourceFailed = require("@/assets/sounds/failed.wav")

export function useAddToClipboard() {
    const soundOfCopy = useAppStore(state => state.soundOfCopy)
    const playerCopy = useAudioPlayer(audioSourceCopy)
    const playerFailed = useAudioPlayer(audioSourceFailed)
    
    const copy = useCallback((value: string) => {
        try {
            Clipboard.setStringAsync(value)
            console.log("Contenu copié dans le presse-papier !")
            if (soundOfCopy) {
                playerCopy.play()
            }
        } catch (e) {
            const error = (e as Error).toString()
            Alert.alert("Error !", error)
            if (soundOfCopy) {
                playerFailed.play()
            }
        }
    }, [soundOfCopy])

    return copy
} 