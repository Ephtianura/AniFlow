// hooks/useUserAnime.ts
"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export enum MyListEnum {
    None = "None",
    Planned = "Planned",
    Watching = "Watching",
    Completed = "Completed",
    Rewatching = "Rewatching",
    On_hold = "On_hold",
    Dropped = "Dropped"
}

export function useUserAnime() {
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const updateAnime = async (animeId: number, myList?: MyListEnum | null, rating?: number | null) => {
        setSaving(true);
        setMessage(null);
        try {
            const params = new URLSearchParams();
            if (myList !== undefined) params.append("myList", myList ?? "");
            if (rating !== undefined) params.append("rating", rating?.toString() ?? "");
            await apiFetch(`/user/UpdateUserAnime?${params.toString()}`, {
                method: "PUT"
            });
            setMessage("Оновлено успішно!");
        } catch (err: any) {
            console.error(err);
            setMessage(err.message || "Помилка оновлення");
        } finally {
            setSaving(false);
        }
    };

    return { updateAnime, saving, message };
}
