"use client"

import { apiFetch } from "@/lib/api"
import { useEffect } from "react"

export default function VisitTracker() {
    useEffect(() => {
        try { apiFetch(`/track-visit`, { method: "POST", }) }
        catch { }
    }, [])

    return null
}