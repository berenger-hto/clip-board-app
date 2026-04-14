import { useFetchQuery } from "@/hooks/useFetchQuery"
import type { Data } from "@/types/types"

export function useClipboardDetails(id: string) {
    return useFetchQuery<{ data: Data }>(`clipboard/${id}`)
}