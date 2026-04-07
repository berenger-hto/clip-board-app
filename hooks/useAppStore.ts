import { create } from "zustand/react";
import { combine } from "zustand/middleware";
import { Data, FilterType } from "@/types/types";

export const useAppStore = create(
    combine(
        {
            tabActiveIndex: 0,
            isRedirect: false,
            appTheme: null as "dark" | "light" | null,
            autoSync: true,
            ip: null as string | null,
            token: null as string | null,
            soundOfCopy: true,
            data: null as Data[] | null,
            filterIndicator: "ALL" as FilterType["indicator"],
            started: false,
            firstStart: false,
            clipboardIsLoad: false
        },
        (set) => (
            {
                setTabActiveIndex: (index: number) => set({ tabActiveIndex: index }),
                setIsRedirect: (isRedirect: boolean) => set({ isRedirect }),
                setAppTheme: (appTheme: "dark" | "light") => set({ appTheme }),
                setAutoSync: (autoSync: boolean) => set({ autoSync }),
                setIp: (ip: string | null) => set({ ip }),
                setToken: (token: string | null) => set({ token }),
                setSoundOfCopy: (soundOfCopy: boolean) => set({ soundOfCopy }),
                setData: (data: Data[] | null) => set({ data }),
                setFilterIndicator: (filterIndicator: FilterType["indicator"]) => set({ filterIndicator }),
                setStarted: (started: boolean) => set({ started }),
                setFirstStart: (firstStart: boolean) => set({ firstStart }),
                setClipboardIsLoad: (clipboardIsLoad: boolean) => set({ clipboardIsLoad })
            }
        )
    )
)