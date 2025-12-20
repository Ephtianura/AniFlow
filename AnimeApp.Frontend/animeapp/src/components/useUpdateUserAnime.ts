"use client";
import { useState } from "react";

export type MyListOption = "None" | "Planned" | "Watching" | "Completed" | "Rewatching" | "On_hold" | "Dropped";

export function useUpdateUserAnime() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const updateAnime = async (animeId: number, list: MyListOption | null = null, rating: number | null = null) => {
        if (list === null && rating === null) return;
        setLoading(true);
        setError(null);
        setSuccess(null);

        const params = new URLSearchParams();
        if (list !== null) params.append("myList", list);
        if (rating !== null) params.append("rating", rating.toString());

        try {
            const res = await fetch(`/api/user/UpdateUserAnime?${params.toString()}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ animeId }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data?.message || "Помилка оновлення аніме");
            }

            setSuccess("Оновлено успішно!");
        } catch (err: any) {
            setError(err.message || "Помилка");
        } finally {
            setLoading(false);
        }
    };

    return { updateAnime, loading, error, success };
}
