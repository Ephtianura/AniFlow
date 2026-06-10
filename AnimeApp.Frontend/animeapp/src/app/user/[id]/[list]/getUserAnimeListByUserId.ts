import { MyListEnum } from "@/core/enums/MyList";
import { UserAnimeList } from "@/core/types";
import { apiFetch } from "@/lib/api";
import { headers } from "next/headers";

export async function getUserAnimeListByUserId(
  userId: string,
  myList?: MyListEnum,
  isFavorite?: boolean,
) {
  try {

    const params = new URLSearchParams();
    if (myList) params.append("myList", myList);

    if (isFavorite === true) params.append("isFavorite", "true");

    const query = params.toString();

    const url = `/user/${userId}/animes${query ? `?${query}` : ""}`;

    return await apiFetch<UserAnimeList>(url, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
  } catch {
    return null;
  }
}
