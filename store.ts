import {create} from "zustand/react";
import {combine} from "zustand/middleware";

export const useAppStore = create(
    combine({ tabActiveIndex: 0 }, (set) => ({
        setTabActiveIndex: (index: number) => set(() => ({ tabActiveIndex: index }))
    }))
)