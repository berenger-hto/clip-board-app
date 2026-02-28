import * as Clipboard from "expo-clipboard"
import { useCallback, useEffect } from "react";
import {Alert} from "react-native";
import { useAudioPlayer } from 'expo-audio';

const audioSourceCopy = require("@/assets/sounds/copy.wav")
const audioSourceFailed = require("@/assets/sounds/failed.wav")

export function useAddToClipboard() {
    const playerCopy = useAudioPlayer(audioSourceCopy)
    const playerFailed = useAudioPlayer(audioSourceFailed)
    const copy = useCallback((value: string) => {
        try {
            Clipboard.setStringAsync(value)
            console.log("Contenu copié dans le presse-papier !")
            playerCopy.play()
        } catch (e) {
            const error = (e as Error).toString()
            Alert.alert("Error !", error)
            playerFailed.play()
        }
    }, [])
    return copy
} 