import { ClientData } from "@/types/types"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "react-native-toast-notifications"

type DefaultResponse = {
    success: boolean
    message: string
}

const defaultResponse = {
    success: false,
    message: "Une erreur s'est produite"
} satisfies DefaultResponse

const PORT = 9876

type API = {
    "v1/auth/me": DefaultResponse & {
        os: {
            deviceName?: string
            username?: string
            platform?: string
        }
    }
}

export function useMutationQuery<T extends keyof API>(path: T) {
    const toast = useToast()
    return useMutation({
        mutationKey: [path],
        mutationFn: async (mutateData: ClientData) => {
            const response = await fetch(`http://${mutateData.ip}:${PORT}/${path}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mutateData)
            })

            const data = await response.json() as API[T]

            if (!response.ok) {
                return data
            }

            return data
        },
        onError: () => {
            toast.show("Connexion échouée !", {
                type: "danger"
            })
        }
    })
}