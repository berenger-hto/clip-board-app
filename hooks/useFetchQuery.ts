import {DefaultResponse, OS } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { useSecureStore } from "./useSecureStore"
import { useEffect, useState } from "react"

type API = {
    "v1/device": DefaultResponse & {
        os: OS
    }
}

const PORT = 9876

export function useFetchQuery<T extends keyof API>(path: T) {
    const [ip, setIp] = useState<string | null>(null)
    const { getValue } = useSecureStore()
    useEffect(() => {
        getValue("ip").then((ip) => {
            setIp(ip)
        })
    }, [])

    return useQuery({
        queryKey: [path],
        queryFn: async () => {
            const response = await fetch(`http://${ip ?? "127.0.0.1"}:${PORT}/${path}`)
            const data = await response.json()
            return data as API[T]
        }    
    })

}