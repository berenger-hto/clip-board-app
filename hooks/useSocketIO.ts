import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import { useSecureStore } from "./useSecureStore";

const PORT = 9876

export function useSocketIO() {
    const [ip, setIp] = useState<string | null>(null)
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const { getValue } = useSecureStore()

    useEffect(() => {
        getValue("ip").then((ip) => setIp(ip))
    }, [])

    useEffect(() => {
        if (!ip) return
        const socket = io("http://" + ip + ":" + PORT)
        socket.on("connect", () => setIsConnected(true))
        socket.on("disconnect", () => setIsConnected(false))
        setSocket(socket)
    }, [ip])

    return { socket, isConnected }
}