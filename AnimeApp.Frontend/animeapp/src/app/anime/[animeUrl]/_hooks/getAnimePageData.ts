import { useUserAnimeStore } from "@/app/store/useUserAnimeStore";
import { Anime, UserAnime } from "@/core/types";
import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";

export async function getAnimePageData(animeUrl: string) {

  const { anime, userAnimeData } = await apiFetch<{anime: Anime; userAnimeData: UserAnime | null;}> (`/anime/${animeUrl}`);
  
    if (!anime || !anime.id) {
    notFound()
  }

  return { anime, userAnimeData };
}