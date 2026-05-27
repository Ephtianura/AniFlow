import { UserMeResponse } from "@/core/types";
import { apiFetch } from "@/lib/api";
import { headers } from "next/headers";

export async function getMe() {
  try {
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const userMe = await apiFetch<UserMeResponse>(`/user/me`, {
      cookieHeader,
      cache: "no-store",
      next: { revalidate: 0 },
    });
    return userMe;
  } catch (e: any) {
    return null;
  }
}