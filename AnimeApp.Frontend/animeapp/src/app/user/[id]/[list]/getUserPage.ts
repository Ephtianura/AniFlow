import { User } from "@/core/types";
import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";

export async function getUserPage(userId: string) {
  try {
    return await apiFetch<User>(`/user/${userId}`, {cache: "no-store",next: { revalidate: 0 },});
  } catch {
    notFound();
  }
}
