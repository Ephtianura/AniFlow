import { MyListEnum } from "@/core/enums/MyList";
import { UserAnimeList } from "@/core/types";
import { apiFetch } from "@/lib/api";

import { headers } from "next/headers";

export async function getUserAnimeList(
  myList?: MyListEnum,
  isFavorite?: boolean,
) {
  try {
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const params = new URLSearchParams();

    if (myList) params.append("myList", myList);

    if (isFavorite === true) params.append("isFavorite", "true");

    const url = `/user/me/animes?${params.toString()}`;

    const userStatus = await apiFetch<UserAnimeList>(url, {
      cookieHeader,
      cache: "no-store",
      next: { revalidate: 0 },
    });
    return userStatus;
  } catch (e: any) {
    return null;
  }
}
