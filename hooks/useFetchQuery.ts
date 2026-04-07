import { useQuery } from "@tanstack/react-query"
import { useAppStore } from "./useAppStore"
import { DefaultResponse } from "@/types/types"
import { UseQueryOptions } from "@tanstack/react-query"

const PORT = 9876
const VERSION = "v1"

export function useFetchQuery<T>(
    path: string,
    options?: RequestInit,
    queryOptions?: Partial<UseQueryOptions<DefaultResponse & T, Error>>
) {
    const ip = useAppStore(state => state.ip)
    const token = useAppStore(state => state.token)

    const queryKey = path.includes('?') ? [path.split('?')[0], path] : [path]
    return useQuery({
        queryKey,
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
            return data as (DefaultResponse & T)
        },
        ...queryOptions
    })
}