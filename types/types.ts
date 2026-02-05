export type Data = {
    id: number
    type: "CODE" | "TEXT" | "URL"
    // La durée en timestamp
    createdAt: number
    source: "Mobile" | "PC"
    value: string
}