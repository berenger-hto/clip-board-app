import { Data } from "@/types/types";

export const DATA_MOCK: Data[] = [
    {
        id: "1",
        type: "TEXT",
        createdAt: 1710345600000,
        source: "PC",
        value: "Bienvenue sur l'application Clip Board ! C'est un exemple de texte copié depuis votre ordinateur."
    },
    {
        id: "2",
        type: "URL",
        createdAt: 1710345700000,
        source: "Mobile",
        value: "https://github.com/berenger/clip-board-application"
    },
    {
        id: "3",
        type: "CODE",
        createdAt: 1710345800000,
        source: "PC",
        value: "const greeting = 'Hello World';\nconsole.log(greeting);"
    },
    {
        id: "4",
        type: "TEXT",
        createdAt: 1710345900000,
        source: "Mobile",
        value: "Une note importante prise rapidement sur mon téléphone."
    },
    {
        id: "5",
        type: "URL",
        createdAt: 1710346000000,
        source: "PC",
        value: "https://reactnative.dev/"
    },
    {
        id: "6",
        type: "CODE",
        createdAt: 1710346100000,
        source: "Mobile",
        value: "print(\"Hello from Python\")"
    }
];