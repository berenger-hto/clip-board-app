export type Data = {
    id: string
    type: "CODE" | "TEXT" | "URL"
    // La durée en timestamp
    createdAt: number
    source: "Mobile" | "PC"
    value: string
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