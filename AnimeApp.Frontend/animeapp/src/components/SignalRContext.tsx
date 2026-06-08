"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
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
            console.log("Generated fresh guest session identifier:", uuid);
        }

        const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL!;
        
        const conn = new HubConnectionBuilder()
            .withUrl(`${HUB_URL}/hubs/online`, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build()

        conn.on("UpdateOnlineCount", (data: OnlineData) => {
            setOnline(data)
        })

        conn.start()
            .then(() => {
                console.log("SignalR Global Connection Started")
                setConnection(conn)
            })
            .catch(err => console.error("SignalR Global Error: ", err))

        return () => {
            conn.stop()
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