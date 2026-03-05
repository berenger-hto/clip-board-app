import { useEffect, useState } from "react"
import { useAppStore } from "./useAppStore"
import { useFetchQuery } from "./useFetchQuery"
import { Data } from "@/types/types"

export function useFilterItem() {
    const filterIndicator = useAppStore(state => state.filterIndicator)
    const storedData = useAppStore(state => state.data)
    const [data, setData] = useState<Data[]>([])
    const [isOffline, setIsOffline] = useState(false)
    const {
        data: filterData,
        isSuccess: filterSuccess,
        isPending: isFilterPending,
        isError: isFilterError,
        refetch: refetchFilter
    } = useFetchQuery<{ data: Data[] }>(`filter?f=${filterIndicator}`, undefined, {
        enabled: filterIndicator !== "ALL" && filterIndicator !== "FAVORITES" && !isOffline
    })

    useEffect(() => {
        setIsOffline(false)

        const timeOut = setTimeout(() => {
            if (!filterSuccess || !filterData?.success) {
                console.log("Offline filter")
                setIsOffline(true)
            }
        }, 2000)

        if (filterSuccess && filterData.success) {
            setData(filterData.data)
        }

        return () => clearTimeout(timeOut)

    }, [filterSuccess, filterIndicator])

    useEffect(() => {
        if (isOffline || !filterSuccess) {
            setData(() => {
                if (!storedData) return []
                if (filterIndicator === "ALL" || filterIndicator === "FAVORITES") return storedData
                return storedData.filter(d => d.type === filterIndicator)
            })
        }

    }, [isOffline, filterSuccess, storedData, filterIndicator])

    return {
        data,
        isOffline,
        isLoading: isFilterPending && !isOffline,
        filterSuccess,
        isFilterPending,
        isFilterError,
        refetchFilter
    }
}