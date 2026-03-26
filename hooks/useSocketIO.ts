import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import { useAppStore } from "./useAppStore";

const PORT = 9876
let socketInstance: Socket | null = null
let currentIp: string | null = null

export function useSocketIO() {
    const ip = useAppStore(state => state.ip)
    const [isConnected, setIsConnected] = useState(socketInstance?.connected || false)

    useEffect(() => {
        if (!ip) {
            if (socketInstance) {
                socketInstance.disconnect()
                socketInstance = null
                currentIp = null
                setIsConnected(false)
            }
            return
        }

        if (!socketInstance || ip !== currentIp) {
            if (socketInstance) {
                socketInstance.disconnect()
            }

            currentIp = ip
            socketInstance = io(`http://${ip}:${PORT}`, {
                transports: ["websocket"],
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 2000
            })
        }

        const onConnect = () => {
            setIsConnected(true)
        }

        const onDisconnect = () => {
            setIsConnected(false)
        }

        const onConnectError = (error: any) => {
            setIsConnected(false)
        }

        socketInstance.on("connect", onConnect)
        socketInstance.on("disconnect", onDisconnect)
        socketInstance.on("connect_error", onConnectError)

        setIsConnected(socketInstance.connected)

        return () => {
            if (socketInstance) {
                socketInstance.off("connect", onConnect)
                socketInstance.off("disconnect", onDisconnect)
                socketInstance.off("connect_error", onConnectError)
            }
        }
    }, [ip])

    return { socket: socketInstance, isConnected }
}