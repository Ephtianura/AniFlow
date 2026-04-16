"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export interface AnimeResponse {
    id: number;
    titles: { value: string; language: string; type: string }[];
    year: number;
    season: string;
    score: number;
    episodes: number;
    kind: string;
    status: string;
    genres: { nameUa: string }[];
    studio: { name: string };
}

export function useAnimes() {
    const [animes, setAnimes] = useState<AnimeResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    apiFetch("/animes")
    .then((data: { items: AnimeResponse[] }) => {
        const sanitized = data.items.map((item: AnimeResponse) => ({
            ...item,
            studio: item.studio ?? { name: "Unknown" } // безопасно
        }));
        setAnimes(sanitized);
        setLoading(false);
    });


    }, []);

    return { animes, loading };
}
