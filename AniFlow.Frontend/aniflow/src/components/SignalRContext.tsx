"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { HubConnection, HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr"

interface OnlineData {
    total: number
    users: number
    guests: number
}

interface SignalRContextType {
    connection: HubConnection | null
    onlineCount: number
    usersCount: number
    guestsCount: number
}

const SignalRContext = createContext<SignalRContextType>({
    connection: null,
    onlineCount: 0,
    usersCount: 0,
    guestsCount: 0
})

export function SignalRProvider({ children }: { children: React.ReactNode }) {
    const [connection, setConnection] = useState<HubConnection | null>(null)
    const [online, setOnline] = useState<OnlineData>({ total: 0, users: 0, guests: 0 })

    useEffect(() => {
        if (typeof window !== "undefined" && !document.cookie.includes("guest_session_id=")) {
            const uuid = crypto.randomUUID();
            document.cookie = `guest_session_id=${uuid}; path=/; SameSite=Lax; Secure`;
        }

        const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL!;
        let isMounted = true;

        const conn = new HubConnectionBuilder()
            .withUrl(`${HUB_URL}/hubs/online`, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect([0, 2000, 10000, 30000])
            .build()

        conn.on("UpdateOnlineCount", (data: OnlineData) => {
            if (isMounted) setOnline(data)
        })

        conn.onreconnecting((error) => {
            console.warn(`WebSocket Connection lost. Reconnecting...`, error?.message);
        });

        // conn.onreconnected((connectionId) => {
        // console.log(`[SignalR] Connection re-established. ID: ${connectionId}`);
        // });

        conn.start()
            .then(() => {
                if (isMounted) {
                    setConnection(conn)
                }
            })
            .catch(() => {
                console.warn("WebSocket Failed to connect. Will retry automatically. Internal message omitted.");
            })

        return () => {
            isMounted = false;
            // Останавливаем соединение при размонтировании компонента
            if (conn) {
                conn.stop()
                    .catch(e => console.log("WebSocket Stop Error:", e));
            }
        }
    }, [])

    return (
        <SignalRContext.Provider value={{
            connection,
            onlineCount: online.total,
            usersCount: online.users,
            guestsCount: online.guests
        }}>
            {children}
        </SignalRContext.Provider>
    )
}

export const useSignalR = () => useContext(SignalRContext)