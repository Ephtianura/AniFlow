import { useEffect } from "react";
import { Anime } from "@/core/types";

export function useAnimePageEffects(params: {
  animeUrl: string;
  anime: Anime | null;
  loading: boolean;
  error: string | null;
  router: any;
}) {
  const { animeUrl, anime, loading, error, router } = params;

  // URL redirect logic
  useEffect(() => {
    async function fetchAnime() {
      const lastPart = animeUrl.split("-").at(-1);

      if (!/^\d+$/.test(lastPart || "")) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Animes/${lastPart}`
      );

      const data = await res.json();

      if (data?.url && data.url !== animeUrl) {
        router.replace(`/anime/${data.url}`);
      }
    }

    fetchAnime();
  }, [animeUrl, router]);

  // not found redirect
  useEffect(() => {
    if (!loading && !error && anime === null) {
      router.replace("/not-found");
    }
  }, [anime, loading, error, router]);

  // title
  const title =
    anime?.titles.find(
      (t) => t.language === "Ukrainian" && t.type === "Official"
    )?.value ||
    anime?.titles.find(
      (t) => t.language === "Romaji" && t.type === "Official"
    )?.value ||
    anime?.titles.find((t) => t.language === "Romaji")?.value;

  useEffect(() => {
    if (title) {
      document.title = `${title} | AniFlow`;
    }
  }, [title]);
  
  return {
    title,
  };
}