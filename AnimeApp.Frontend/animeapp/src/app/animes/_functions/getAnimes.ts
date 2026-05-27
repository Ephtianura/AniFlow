  import { Animes, PagedResult } from "@/core/types";
  import { apiFetch } from "@/lib/api";

  export async function getAnimes(apiQuery: string) {
    try {
      const res = await apiFetch<PagedResult<Animes>>(`/anime?${apiQuery}`);
      return res;
    } catch (err: any) {
      return undefined;
    }
  }
