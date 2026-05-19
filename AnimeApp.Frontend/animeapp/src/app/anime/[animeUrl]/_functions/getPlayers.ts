import { PlayerEpisodeSet } from "@/core/types";
import { apiFetch } from "@/lib/api";

export async function getPlayers(malId?: number) {
  if(!malId) return [];
  return await apiFetch<PlayerEpisodeSet[]>(`/anime/episodes/${malId}`);
}
