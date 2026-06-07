import { Studio } from "@/core/types";
import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";

export async function getStudio(studioSlug: string) {
  try {
    const studio = await apiFetch<Studio>(`/studios/${studioSlug}`); // !!!! ID !!!!!!!!!
    if (!studio) notFound();
    return studio;
  } catch {
    notFound();
  }
}
