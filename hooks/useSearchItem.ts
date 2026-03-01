import { useCallback, useEffect, useRef, useState } from "react";
import { useFetchQuery } from "./useFetchQuery";
import { Data } from "@/types/types";
import { useAppStore } from "./useAppStore";

export function useSearchItem() {
    const abortController = useRef<AbortController | null>(null)
    const timeOut = setTimeout(() => {
        abortController.current?.abort()
    }, 2000)
    const storedData = useAppStore(state => state.data)

    const [data, setData] = useState<Data[] | null>(null)

    const search = useCallback((searchItem: string) => {
        abortController.current?.abort()
        abortController.current = new AbortController()
        const { refetch, isSuccess, data: queryData } = useFetchQuery<{ data: Data[] }>(`search?q=${searchItem}`, {
            signal: abortController.current.signal
        })

        useEffect(() => {
            if (isSuccess && queryData.success) {
                clearTimeout(timeOut)
                setData(queryData.data)
                return
            }

            setData(storedData)
            
        }, [isSuccess])

        // logique de recherche offline ici
        
    }, [])

    return search
}