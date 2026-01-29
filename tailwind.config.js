/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",         // Fichier racine
    "./app/**/*.{js,jsx,ts,tsx}",     // Dossier app (si tu utilises Expo Router)
    "./src/**/*.{js,jsx,ts,tsx}",     // Dossier source (si tu en as un)
    "./components/**/*.{js,jsx,ts,tsx}", // Dossier composants
    "./screens/**/*.{js,jsx,ts,tsx}",    // Dossier écrans
    "./constants/**/*.{js,jsx,ts,tsx}",  // Parfois on met des classes dans les constantes
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}