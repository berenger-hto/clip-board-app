import {create} from "zustand/react";
import {combine} from "zustand/middleware";

export const useAppStore = create(
    combine({ tabActiveIndex: 0, modalIsVisible: false }, (set) => ({
        setTabActiveIndex: (index: number) => set(() => ({ tabActiveIndex: index })),
        setModalIsVisible: (isVisible: boolean) => set(() => ({ modalIsVisible: isVisible }))
    }))
)