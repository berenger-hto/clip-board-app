import { ClientData, MobileDevice } from "@/types/types"
import { useMutation } from "@tanstack/react-query"
import { DefaultResponse } from "@/types/types"
import { useAppStore } from "./useAppStore"

const PORT = 9876
const VERSION = "v1"

type MutationData = {
    "/me": ClientData & MobileDevice
}

export function useMutationQuery<M = void, T = DefaultResponse>(
    path: string,
    method: "POST" | "PATCH" | "DELETE" = "POST",
    onError?: () => void
) {
    const ip = useAppStore(state => state.ip)
    const token = useAppStore(state => state.token)

    return useMutation({
        mutationKey: [path, method],
        mutationFn: async (mutateData?: M) => {
            const currentIp = path === "/me" ? (mutateData as unknown as MutationData["/me"]).ip : ip
            const options: RequestInit = {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ?? ""
                }
            }

            if ((method === "POST" || method === "PATCH") && mutateData) {
                options.body = JSON.stringify(mutateData)
            }

            const response = await fetch(`http://${currentIp}:${PORT}/${VERSION}/${path}`, options)

            const data = await response.json()
            return data as T
        },
        onError
    })
}