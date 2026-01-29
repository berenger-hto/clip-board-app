import {Data} from "@/types/types";

export const DATA_MOCK: Data[] = [
    {
        id: 1,
        type: "CODE",
        duration: 120,
        from: "PC",
        value: "const primaryColor = \"#13a4ec\";\nexport default config;"
    },
    {
        id: 2,
        type: "URL",
        duration: 45,
        from: "Mobile",
        value: "https://github.com/facebook/react-native"
    },
    {
        id: 3,
        type: "TEXT",
        duration: 300,
        from: "PC",
        value: "Penser à vérifier les dépendances du projet avant la mise en production lundi matin."
    },
    {
        id: 4,
        type: "CODE",
        duration: 85,
        from: "PC",
        value: "function greet(name) {\n  return `Hello, ${name}!`;\n}"
    },
    {
        id: 5,
        type: "URL",
        duration: 15,
        from: "Mobile",
        value: "https://stackoverflow.com"
    },
    {
        id: 6,
        type: "CODE",
        duration: 210,
        from: "PC",
        value: "import { useState, useEffect } from 'react';\n\nconst useAuth = () => {\n  const [user, setUser] = useState(null);\n  return user;\n};"
    },
    {
        id: 7,
        type: "TEXT",
        duration: 60,
        from: "Mobile",
        value: "Acheter du pain et du lait en rentrant."
    },
    {
        id: 8,
        type: "URL",
        duration: 10,
        from: "PC",
        value: "https://tailwind-native.com"
    },
    {
        id: 9,
        type: "TEXT",
        duration: 150,
        from: "Mobile",
        value: "Réunion prévue à 14h avec l'équipe design pour le nouveau dashboard."
    },
    {
        id: 10,
        type: "CODE",
        duration: 45,
        from: "PC",
        value: "{\"status\": 200, \"message\": \"Success\", \"data\": []}"
    },
    {
        id: 11,
        type: "URL",
        duration: 5,
        from: "Mobile",
        value: "google.com"
    },
    {
        id: 12,
        type: "TEXT",
        duration: 500,
        from: "PC",
        value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor."
    }
];