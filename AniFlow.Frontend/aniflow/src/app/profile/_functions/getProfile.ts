import { UserProfile } from "@/core/types";
import { apiFetch } from "@/lib/api";
import { redirect } from "next/navigation";

import { headers } from "next/headers";

export async function getProfile() {
  try {
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const userStatus = await apiFetch<UserProfile>(`/user/me/profile`, {
      cookieHeader,
      cache: "no-store",
      next: { revalidate: 0 },
    });
    return userStatus;
  } catch (e: any) {
    redirect("/login");
  }
}
