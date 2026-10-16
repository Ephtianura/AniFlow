import { FriendResponse } from "@/core/types";
import { apiFetch } from "@/lib/api";

import { headers } from "next/headers";

export async function getFriends() {
  try {
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const friends = await apiFetch<FriendResponse[]>(`/friends`, {
      cookieHeader,
      cache: "no-store",
      next: { revalidate: 0 },
    });
    return friends;
    // return Array(8)
    // .fill(null)
    // .flatMap(() => friends);
  } catch (e: any) {
    return [];
  }
}
export async function getFriendsById(id: number | string) {
  try {
    const friends = await apiFetch<FriendResponse[]>(`/friends/${id}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    return friends;
  } catch (e: any) {
    return [];
  }
}
