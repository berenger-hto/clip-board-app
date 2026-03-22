import * as SecureStore from 'expo-secure-store';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from './useAppStore';

export function useSecureStore() {
    const toast = useToast()
    const setIp = useAppStore(state => state.setIp)
    const setToken = useAppStore(state => state.setToken)

    /**
     * Enregistre une valeur de manière sécurisée.
     */
    const setValue = async (key: string, value: string) => {
        try {
            await SecureStore.setItemAsync(key, value)
            if (key === "ip") setIp(value)
            if (key === "token") setToken(value)
        } catch (error) {
            console.error(`Erreur SecureStore (save ${key}) :`, error)
            toast.show("Erreur de sauvegarde", {
                type: "danger"
            })
        }
    }

    /**
     * Récupère une valeur enregistrée.
     */
    const getValue = async (key: string) => {
        try {
            return await SecureStore.getItemAsync(key)
        } catch (error) {
            console.error(`Erreur SecureStore (get ${key}) :`, error)
            toast.show("Erreur de lecture", {
                type: "danger"
            })
            return null
        }
    }

    /**
     * Supprime une valeur.
     */
    const deleteValue = async (key: string) => {
        try {
            await SecureStore.deleteItemAsync(key)
            if (key === "ip") setIp(null)
            if (key === "token") setToken(null)
        } catch (error) {
            console.error(`Erreur SecureStore (delete ${key}) :`, error)
            toast.show("Erreur de suppression", {
                type: "danger"
            })
        }
    }

    return { setValue, getValue, deleteValue }
}