import { useEffect } from "react";
import { Anime, TitleLanguage, TitleType } from "@/core/types";
import { apiFetch } from "@/lib/api";

export function useAnimePageEffects(params: {
  animeUrl: string;
  anime: Anime | null;
  router: any;
}) {
  const { animeUrl, anime, router } = params;

  // URL redirect logic
  useEffect(() => {
    async function fetchAnime() {

      const lastPart = animeUrl.split("-").at(-1);

      if (!/^\d+$/.test(lastPart || "")) return;

      // Костыль, наверное лучше потом добавить ендпоинт для поиска аниме по slug напрямую вместо айди...
      const data = await apiFetch(`/Animes/${lastPart}`);

      if (data?.url && data.url !== animeUrl) {
        router.replace(`/anime/${data.url}`);
      }
    }

    fetchAnime();
  }, [animeUrl, router]);

  // title
  const title =
    anime?.titles.find(
      (t) => t.language === TitleLanguage.Ukrainian && t.type === TitleType.Official
    )?.value ||
    anime?.titles.find(
      (t) => t.language === TitleLanguage.Romaji && t.type === TitleType.Official
    )?.value ||
    anime?.titles.find((t) => t.language === TitleLanguage.Romaji)?.value;

  useEffect(() => {
    if (title) {
      document.title = `${title} | AniFlow`;
    }
  }, [title]);
  
  return {
    title,
  };
}