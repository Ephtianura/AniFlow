import { Anime, UserAnime } from "@/core/types";
import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";
import { cache } from 'react';
import { headers } from "next/headers";


// Функция которая возвращает данные аниме + юзер дата с кешированием
export const getAnimePageData = cache(async (animeUrl: string) => {
  const cookieHeader = (await headers()).get("cookie") ?? "";
  const { anime, userStatus } = await apiFetch<{ anime: Anime; userStatus: UserAnime | null }>(
    `/animes/slug/${animeUrl}`,
    { cookieHeader, next: { revalidate: 5 } }, 
    
  );

    if (!anime || !anime.id) {
    notFound()
  }
  return { anime, userStatus };
});