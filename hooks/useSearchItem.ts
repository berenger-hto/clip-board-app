import { useEffect, useState } from "react";
import { useFetchQuery } from "./useFetchQuery";
import { Data } from "@/types/types";
import { useAppStore } from "./useAppStore";
import { useToast } from "react-native-toast-notifications";

export function useSearchItem() {
    const [searchTerm, setSearchTerm] = useState("")
    const [results, setResults] = useState<Data[]>([])
    const [isOfflineMode, setIsOfflineMode] = useState(false)
    const storedData = useAppStore(state => state.data)
    const toast = useToast()

    const { data: queryData, isSuccess, isLoading } = useFetchQuery<{ data: Data[] }>(
        `search?q=${searchTerm}`,
        {},
        { enabled: searchTerm.length > 0 && !isOfflineMode }
    )

    useEffect(() => {
        if (searchTerm.length === 0) {
            setResults([])
            setIsOfflineMode(false)
            return
        }

        setIsOfflineMode(false)

        const timer = setTimeout(() => {
            if (!isSuccess && searchTerm.length > 0) {
                console.log("Search timeout - switching to offline mode")
                setIsOfflineMode(true)
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [searchTerm, isSuccess])

    useEffect(() => {
        if (!isSuccess || !queryData) return

        if (queryData.success) {
            setResults(queryData.data)
            setIsOfflineMode(false)
        } else {
            toast.show(queryData.message, {
                type: "danger"
            })
        }

    }, [isSuccess, queryData])

    useEffect(() => {
        if (isOfflineMode && storedData && searchTerm) {
            const filtered = storedData.filter(item =>
                item.value.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setResults(filtered)
        }
    }, [isOfflineMode, storedData, searchTerm])

    return {
        search: setSearchTerm,
        results,
        isOfflineMode,
        isLoading: isLoading && !isOfflineMode
    }
}