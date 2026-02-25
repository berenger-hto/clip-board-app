import { useQuery } from "@tanstack/react-query"
import { useAppStore } from "./useAppStore"
import { DefaultResponse } from "@/types/types"

const PORT = 9876
const VERSION = "v1"

export function useFetchQuery<T>(path: string, options?: RequestInit) {
    const ip = useAppStore(state => state.ip)
    const token = useAppStore(state => state.token)

    return useQuery({
        queryKey: [path],
        queryFn: async () => {
            const response = await fetch(`http://${ip ?? "127.0.0.1"}:${PORT}/${VERSION}/${path}`, {
                ...options,
                headers: {
                    "Accept": "application/json",
                    "Authorization": token ?? "",
                    ...options?.headers
                }
            })
            const data = await response.json()
            return data as DefaultResponse & T
        }
    })
}