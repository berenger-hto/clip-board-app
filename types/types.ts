export type Data = {
    id: number
    type: "CODE" | "TEXT" | "URL"
    // La durée en timestamp
    duration: number
    from: "Mobile" | "PC"
    value: string
}