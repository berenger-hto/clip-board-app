import { useAppStore } from "./useAppStore"
import { useFetchQuery } from "./useFetchQuery"
import type { ClipboardQuery, Data } from "@/types/types"
import { useFilterItem } from "./useFilterItem"

export function useClipboardQuery() {
    const token = useAppStore(state => state.token)
    const ip = useAppStore(state => state.ip)
    const filterIndicator = useAppStore(state => state.filterIndicator)

    const {
        data: clipboardData,
        isPending: isClipboardPending,
        isSuccess: isClipboardSuccess,
        isError: isClipboardError,
        refetch: refetchClipboard,
        isRefetching: isClipboardRefetching,
        isRefetchError: isClipboardRefetchError
    } = useFetchQuery<{ data: Data[] }>("clipboard", undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: !!ip && !!token
    })

    const {
        filterSuccess,
        data: filterData,
        isFilterPending,
        isFilterError,
        refetchFilter,
        isFilterRefetching,
        isFilterRefetchError
    } = useFilterItem()

    const isFiltering = filterIndicator !== "ALL"
    const data = isFiltering ? filterData : clipboardData?.data ?? []
    const isPending = isFiltering ? isFilterPending : isClipboardPending
    const isSuccess = isFiltering ? filterSuccess : isClipboardSuccess
    const isError = isFiltering ? isFilterError : isClipboardError
    const refetch = isFiltering ? refetchFilter : refetchClipboard
    const isRefetching = isFiltering ? isFilterRefetching : isClipboardRefetching
    const isRefetchError = isFiltering ? isFilterRefetchError : isClipboardRefetchError

    return {
        ip,
        token,
        isFiltering,
        data,
        isPending,
        isSuccess,
        isError,
        isRefetchError,
        isRefetching,
        refetch,
        clipboardData
    } satisfies ClipboardQuery
}