import { Data } from "@/types/types";
import { FlashListRef } from "@shopify/flash-list";
import { RefObject, useCallback } from "react";

export function useScrollToTop(listRef: RefObject<FlashListRef<Data> | null>) {
    return useCallback((duration: number = 100) => {
        if (listRef.current) {
            setTimeout(() => {
                listRef.current?.scrollToIndex({
                    index: 0,
                    animated: true
                })
            }, duration)
        }
    }, [])
}