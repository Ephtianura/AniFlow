import { User } from "@/core/types";
import { apiFetch } from "@/lib/api";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export async function getUserPage(userId: string) {
  try {
    const cookieHeader = (await headers()).get("cookie") ?? "";

    return await apiFetch<User>(`/user/${userId}`, {
      cookieHeader,
      cache: "no-store",
      next: { revalidate: 0 },
    });
  } catch {
    notFound();
  }
}
