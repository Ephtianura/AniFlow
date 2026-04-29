import { UserAnime } from "@/core/types";
import { apiFetch } from "@/lib/api";
import { headers } from "next/headers";

export async function getUserStatus(animeId: number) {
  try {
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const userStatus = await apiFetch<UserAnime | null>(
      `/user/me/animes/${animeId}`,
      { cookieHeader, cache: "no-store", next: { revalidate: 0 } },
    );
    return userStatus;
  } catch {
    return null;
  }
}
