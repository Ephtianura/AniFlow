import { PlayerEpisodeSet } from "@/core/types";
import { apiFetch } from "@/lib/api";

export async function getPlayers(malId?: number) {
  if (!malId) return [];
  try {
    return await apiFetch<PlayerEpisodeSet[]>(`/anime/episodes/${malId}`);
  } catch (err) {
    return [];
  }
}
