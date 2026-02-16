import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { useToast } from 'react-native-toast-notifications';

export function useSecureStore() {
    const toast = useToast()

    /**
     * Enregistre une valeur de manière sécurisée.
     */
    const setValue = async (key: string, value: string) => {
        try {
            await SecureStore.setItemAsync(key, value)
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
        } catch (error) {
            console.error(`Erreur SecureStore (delete ${key}) :`, error)
            toast.show("Erreur de suppression", {
                type: "danger"
            })
        }
    }

    return { setValue, getValue, deleteValue }
}