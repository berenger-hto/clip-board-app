import { io, Socket } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "./useAppStore";
import { useNetworkStatus } from "./useNetworkStatus";

const PORT = 9876

export function useSocketIO() {
    const ip = useAppStore(state => state.ip)
    const socketInstance = useRef<Socket | null>(null)
    const lastIp = useRef<string | null>(null)
    const [isConnected, setIsConnected] = useState(socketInstance.current?.connected || false)
    const isWifi = useNetworkStatus()

    useEffect(() => {
        if (!ip || !isWifi) {
            socketInstance.current?.disconnect()
            socketInstance.current = null
            lastIp.current = null
            return
        }   

        const onConnect = () => {
            setIsConnected(true)
        }

        const onDisconnect = () => {
            setIsConnected(false)
        }

        const onConnectError = () => {
            setIsConnected(false)
        } 

        if (!socketInstance.current || ip !== lastIp.current) {
            socketInstance.current?.disconnect()

            socketInstance.current = io(`http://${ip}:${PORT}`, {
                transports: ["websocket"],
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 2000
            })

            lastIp.current = ip

            socketInstance.current.on("connect", onConnect)
            socketInstance.current.on("disconnect", onDisconnect)
            socketInstance.current.on("connect_error", onConnectError)
        }

        return () => {
            socketInstance.current?.off("connect", onConnect)
            socketInstance.current?.off("disconnect", onDisconnect)
            socketInstance.current?.off("connect_error", onConnectError)
        }
    }, [ip, isWifi])

    return { socket: socketInstance.current, isConnected }
}