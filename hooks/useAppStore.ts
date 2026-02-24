import { create } from "zustand/react";
import { combine } from "zustand/middleware";

export const useAppStore = create(
    combine(
        {
            tabActiveIndex: 0,
            isRedirect: false,
            appTheme: null as "dark" | "light" | null,
            autoSync: true,
            ip: null as string | null,
            token: null as string | null
        },
        (set) => (
            {
                setTabActiveIndex: (index: number) => set({ tabActiveIndex: index }),
                setIsRedirect: (isRedirect: boolean) => set({ isRedirect }),
                setAppTheme: (appTheme: "dark" | "light") => set({ appTheme }),
                setAutoSync: (autoSync: boolean) => set({ autoSync }),
                setIp: (ip: string | null) => set({ ip }),
                setToken: (token: string | null) => set({ token })
            }
        )
    )
)