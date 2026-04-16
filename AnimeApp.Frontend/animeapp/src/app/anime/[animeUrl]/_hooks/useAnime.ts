import { useEffect, useState } from "react";
import { Anime } from "@/core/types";

export function useAnime(id: string | number) {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/Animes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.id) setAnime(null);
        else setAnime(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { anime, loading, error };
}