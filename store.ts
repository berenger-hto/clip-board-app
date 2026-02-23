import {create} from "zustand/react";
import {combine} from "zustand/middleware";

export const useAppStore = create(
    combine(
        {
            tabActiveIndex: 0,
            isRedirect: false,
            appTheme: "dark" as "dark" | "light",
            autoSync: true
        },
        (set) => (
            {
                setTabActiveIndex: (index: number) => set({ tabActiveIndex: index }),
                setIsRedirect: (isRedirect: boolean) => set({ isRedirect }),
                setAppTheme: (appTheme: "dark" | "light") => set({ appTheme }),
                setAutoSync: (autoSync: boolean) => set({ autoSync }) 
            }
        )
    )
)