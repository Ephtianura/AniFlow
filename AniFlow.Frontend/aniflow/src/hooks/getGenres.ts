import { Genre } from "@/core/types";
import { apiFetch } from "@/lib/api";

export async function getGenres() {
  try {
    return await apiFetch<Genre[]>(`/Genres`);
  } catch {
    return [];
  }
}
