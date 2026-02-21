export function capitalize(sentence: string) {
    if (!sentence) return
    return sentence[0].toUpperCase() + sentence.slice(1)
}