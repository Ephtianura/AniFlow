import { Anime } from "@/core/types";
import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";

export async function getAnime(animeUrl: string) {
  try {
    const anime = await apiFetch<Anime>(`/anime/slug/${animeUrl}`);
    if (!anime) notFound();
    return anime;
  } catch {
    notFound();
  }
}
