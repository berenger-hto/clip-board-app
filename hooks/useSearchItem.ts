import { useEffect, useState } from "react";
import { useFetchQuery } from "./useFetchQuery";
import { Data } from "@/types/types";
import { useAppStore } from "./useAppStore";
import { useToast } from "react-native-toast-notifications";
import { useDebounce } from "./useDebounce";

export function useSearchItem() {
    const [searchTerm, setSearchTerm] = useState("")
    const [results, setResults] = useState<Data[]>([])
    const [isOfflineMode, setIsOfflineMode] = useState(false)
    const storedData = useAppStore(state => state.data)
    const toast = useToast()

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const { data: queryData, isSuccess, isLoading } = useFetchQuery<{ data: Data[] }>(
        `search?q=${debouncedSearchTerm}`,
        {},
        { enabled: debouncedSearchTerm.length >= 3 && !isOfflineMode }
    )

    useEffect(() => {
        if (debouncedSearchTerm.length === 0) {
            setResults([])
            setIsOfflineMode(false)
            return
        }

        setIsOfflineMode(false)

        const timer = setTimeout(() => {
            if (!isSuccess && debouncedSearchTerm.length > 0) {
                console.log("Search timeout - switching to offline mode")
                setIsOfflineMode(true)
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [debouncedSearchTerm, isSuccess])

    useEffect(() => {
        setResults(queryData?.data ?? [])
        setIsOfflineMode(false)
    }, [queryData])

    useEffect(() => {
        if (!storedData) {
            setResults([])
            return
        }

        if (isOfflineMode && debouncedSearchTerm) {
            const filtered = storedData.filter(item =>
                item.value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            )
            setResults(filtered)
        }
    }, [isOfflineMode, storedData, debouncedSearchTerm])

    return {
        debouncedSearchTerm,
        searchTerm,
        search: setSearchTerm,
        results,
        setResults,
        isOfflineMode,
        isLoading: isLoading && !isOfflineMode
    }
}