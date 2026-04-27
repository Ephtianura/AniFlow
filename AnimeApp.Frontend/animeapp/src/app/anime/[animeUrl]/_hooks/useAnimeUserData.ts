import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type UserAnime = {
  myList: string | null;
  rating: number | null;
  isFavorite: boolean | null;
};

export function useAnimeUserData(animeId?: number) {
  const [data, setData] = useState<UserAnime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!animeId) return;

    setLoading(true);

    apiFetch(`/user/me/animes/${animeId}`)
      .then((res: UserAnime) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Failed to load user anime data:", err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [animeId]);

  return { data, setData, loading };
}