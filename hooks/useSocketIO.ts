import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import { useAppStore } from "./useAppStore";

const PORT = 9876

export function useSocketIO() {
    const ip = useAppStore(state => state.ip)
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        if (!ip) return
        const socket = io("http://" + ip + ":" + PORT)
        socket.on("connect", () => setIsConnected(true))
        socket.on("disconnect", () => setIsConnected(false))
        setSocket(socket)

        return () => {
            socket.disconnect()
        }
    }, [ip])

    return { socket, isConnected }
}