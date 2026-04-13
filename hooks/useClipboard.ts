import { RefObject } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { Data } from "@/types/types";
import { useClipboardQuery } from "./useClipboardQuery";
import { useClipboardSocket } from "./useClipboardSocket";
import { useClipboardSync } from "./useClipboardSync";
import { useClipboardUI } from "./useClipboardUI";

export function useClipboard(listRef: RefObject<FlashListRef<Data> | null>) {

    const query = useClipboardQuery()
    
    useClipboardSocket({ 
        refetch: query.refetch, 
        data: query.data 
    }, listRef)
    
    useClipboardSync({ 
        refetch: query.refetch
    }, listRef)

    useClipboardUI({ 
        isSuccess: query.isSuccess, 
        isError: query.isError, 
        isRefetchError: query.isRefetchError, 
        clipboardData: query.clipboardData 
    })

    return query
}