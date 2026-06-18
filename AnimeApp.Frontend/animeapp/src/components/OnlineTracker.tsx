"use client"

import { useEffect } from "react"
import { HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr"

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL!;

export default function OnlineTracker() {
    useEffect(() => {
        const connection = new HubConnectionBuilder()
        .withUrl(`${HUB_URL}/hubs/online`, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();

        connection.start()
            // .then(() => console.log("SignalR Connected (Online Tracking Active)"))
            .catch(err => console.error("SignalR Connection Error: ", err))

        return () => {
            if (connection) {
                connection.stop()
            }
        }
    }, [])

    return null 
}