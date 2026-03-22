import { useToast as useRNToast } from "react-native-toast-notifications";
import { useEffect, ReactNode } from "react";
import { create } from "zustand";

interface ToastItem {
    message: string | ReactNode
    options?: any
}

interface ToastStore {
    queue: ToastItem[]
    isShowing: boolean
    enqueue: (item: ToastItem) => void
    dequeue: () => ToastItem | undefined
    setIsShowing: (showing: boolean) => void
}

const useToastStore = create<ToastStore>((set, get) => ({
    queue: [],
    isShowing: false,
    enqueue: (item) => set((state) => ({ queue: [...state.queue, item] })),
    dequeue: () => {
        const { queue } = get()
        if (queue.length === 0) return undefined
        const item = queue[0]
        set({ queue: queue.slice(1) })
        return item
    },
    setIsShowing: (isShowing) => set({ isShowing }),
}))

export function ToastQueueManager() {
    const { queue, isShowing, dequeue, setIsShowing } = useToastStore()
    const toast = useRNToast()

    useEffect(() => {
        if (!isShowing && queue.length > 0) {
            const nextToast = dequeue()
            if (nextToast) {
                setIsShowing(true)
                toast.show(nextToast.message, {
                    ...nextToast.options,
                    onClose: () => {
                        setIsShowing(false)
                        if (nextToast.options?.onClose) {
                            nextToast.options.onClose()
                        }
                    }
                })
            }
        }
    }, [queue, isShowing, dequeue, setIsShowing, toast])

    return null
}

export function useToast() {
    const enqueue = useToastStore((state) => state.enqueue)
    const rnToast = useRNToast()

    return {
        ...rnToast,
        show: (message: string | ReactNode, options?: any) => {
            enqueue({ message, options })
            return Math.random().toString(36).substring(7)
        }
    }
}
