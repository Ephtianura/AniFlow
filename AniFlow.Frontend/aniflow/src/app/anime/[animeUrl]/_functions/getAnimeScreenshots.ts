import { apiFetch } from "@/lib/api";
import { headers } from "next/headers";

export async function getAnimeScreenshots(animeId: number) {
  try {
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const screenshots = await apiFetch<string[] | null>(`/anime/${animeId}/screenshots`, {
      cookieHeader,
      cache: "no-store",
      next: { revalidate: 0 },
    });
    return screenshots;
  } catch {
    return null;
  }
}
