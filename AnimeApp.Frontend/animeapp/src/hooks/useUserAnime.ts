// hooks/useUserAnime.ts
"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { MyListEnum } from "@/core/enums/MyList";

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
            await apiFetch(`/user/me/${animeId}?${params.toString()}`, { //TODO
                method: "PATCH"
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
