import { AnimeSitemap } from "@/core/types";
import { apiFetch } from "@/lib/api";

export async function getAnimeSitemap() {
  try {
    return await apiFetch<AnimeSitemap[]>(`/sitemap/anime`, {
      next: { revalidate: 86400 }, 
    });
  } catch {
    return [];
  }
}