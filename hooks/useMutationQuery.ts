import { ClientData, MobileDevice, OS } from "@/types/types"
import { useMutation } from "@tanstack/react-query"
import { DefaultResponse } from "@/types/types"
import { useEffect, useState } from "react"
import { useSecureStore } from "./useSecureStore"

const PORT = 9876

type API = {
    "v1/me": DefaultResponse & {
        os: OS
    }
}

type MutationData = {
    "v1/me": ClientData & MobileDevice
}

export function useMutationQuery<T extends keyof API>(path: T, onError?: () => void) {
    const [ip, setIp] = useState<string | null>(null)
    const { getValue } = useSecureStore()

    useEffect(() => {
        const load = async () => {
            const savedIp = await getValue("ip")
            setIp(savedIp ?? "127.0.0.1")
            console.log("Mutation ip", savedIp)
        }
        load()
    }, [])

    return useMutation({
        mutationKey: [path],
        mutationFn: async (mutateData: MutationData[T]) => {
            const currentIp = path === "v1/me" ? (mutateData as any).ip : ip
            const response = await fetch(`http://${currentIp}:${PORT}/${path}`, {
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
        onError
    })
}