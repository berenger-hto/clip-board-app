import {create} from "zustand/react";
import {combine} from "zustand/middleware";

export const useAppStore = create(
    combine(
        {
            tabActiveIndex: 0,
            isRedirect: false,
            appTheme: null as "dark" | "light" | null,
            autoSync: true
        },
        (set) => (
            {
                setTabActiveIndex: (index: number) => set({ tabActiveIndex: index }),
                setIsRedirect: (isRedirect: boolean) => set({ isRedirect }),
                setAppTheme: (theme: "dark" | "light" | null) => set({ appTheme: theme }),
                setAutoSync: (autoSync: boolean) => set({ autoSync }) 
            }
        )
    )
)