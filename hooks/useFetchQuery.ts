import { Data, DefaultResponse, OS } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { useSecureStore } from "./useSecureStore"
import { useEffect, useState } from "react"

    type API = {
        "v1/device": DefaultResponse & {
            os: OS
        },
        "v1/clipboard": DefaultResponse & {
            data: Data[]
        }
    }

    const PORT = 9876

    export function useFetchQuery<T extends keyof API>(path: T, options?: RequestInit) {
        const [ip, setIp] = useState<string | null>(null)
        const [token, setToken] = useState<string | null>(null)
        const { getValue } = useSecureStore()
        useEffect(() => {
            getValue("ip").then((ip) => {
                setIp(ip)
            })

            getValue("token").then((token) => {
                setToken(token)
            })
            
        }, [])

        return useQuery({
            queryKey: [path],
            queryFn: async () => {
                const response = await fetch(`http://${ip ?? "127.0.0.1"}:${PORT}/${path}`, {
                    ...options,
                    headers: {
                        "Accept": "application/json",
                        "Authorization": path === "v1/clipboard" ? token ?? "" : "",
                        ...options?.headers
                    }
                })
                const data = await response.json()
                return data as API[T]
            }
        })

    }