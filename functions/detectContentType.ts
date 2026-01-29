import {Data} from "@/types/types";

type ContentInputType = Data["type"];

export function contentType (input: string): ContentInputType {
    const trimmedInput = input.trim()

    // 1. Détection URL
    // Regex standard pour les URLs (http, https, ou commençant par www)
    const urlRegex = /^((https?|ftp):\/\/)?(www\.)?([a-z0-9-]+(\.[a-z0-9-]+)+)(:[0-9]+)?(\/[^\s]*)?$/i
    if (urlRegex.test(trimmedInput)) {
        return 'URL'
    }

    // 2. Détection CODE
    // On cherche des marqueurs syntaxiques communs (JS, HTML, CSS, Python)
    const codePatterns = [
        /[{}<>\[\];]/,                // Caractères spéciaux de syntaxe
        /^(const|let|var|function|export|import|class|if|for|while)\s/, // Mots-clés JS
        /<\/?[a-z][\s\S]*>/i,         // Balises HTML/XML
        /=>/,                         // Arrow functions
        /console\.log/                // Debugging
    ]

    const isCode = codePatterns.some(pattern => pattern.test(trimmedInput))

    // On ajoute une sécurité : le code est souvent sur plusieurs lignes ou contient des indentations
    if (isCode || trimmedInput.includes('\n')) {
        return 'CODE'
    }

    // 3. Par défaut, c'est du TEXTE
    return 'TEXT'
}