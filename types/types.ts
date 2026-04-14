import { QueryObserverResult, UseMutationResult } from "@tanstack/react-query"

export type Data = {
    id: string
    type: "CODE" | "TEXT" | "URL"
    createdAt: number
    source: "Mobile" | "PC"
    value: string
    isFavorite: boolean
}

export type ClientData = {
    ip?: string
    token?: string
    expiresAt?: number
}

export type DefaultResponse = {
    success: boolean
    message: string
}

export type OS = {
    deviceName?: string
    username?: string
    platform?: string
}

export type MobileDevice = {
    deviceName: string
    deviceOSName: string
    deviceOSVersion: string
}

export type SegmentedButtonType = "AUTO" | "TEXT" | "URL" | "CODE"

export type FilterType = {
    name: string
    indicator: "ALL" | "URL" | "CODE" | "TEXT" | "FAVORITES"
}

export type ClipboardPayload = {
    content: string
    type: string
    source: Data["source"]
}

export type ClipboardQuery = {
    ip: string | null
    token: string | null
    isFiltering: boolean
    data: Data[]
    isPending: boolean
    isSuccess: boolean
    isError: boolean
    isRefetching: boolean
    isRefetchError: boolean
    refetch: () => Promise<QueryObserverResult<DefaultResponse & {
        data: Data[]
    }, Error>>
    clipboardData: (DefaultResponse & {
        data: Data[]
    }) | undefined
}

export type EditMutation = {
    content: string
    type: SegmentedButtonType
}

export type MutationEffect = {
    deleteMutation: UseMutationResult<DefaultResponse, Error, void, unknown>,
    editMutation: UseMutationResult<DefaultResponse, Error, EditMutation | undefined, unknown>,
    favoriteMutation: UseMutationResult<DefaultResponse, Error, void, unknown>
}
