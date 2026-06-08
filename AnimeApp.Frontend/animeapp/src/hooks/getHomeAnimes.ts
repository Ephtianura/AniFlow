import { AnimeSortBy } from "@/core/enums/AnimeSortBy";
import { SeasonEnum } from "@/core/enums/Season";
import { Animes, PagedResult } from "@/core/types";
import { apiFetch } from "@/lib/api";

type Props = {
  currentYear: number;
  currentSeason: SeasonEnum;
};

export async function getHomeAnimes({ currentYear, currentSeason }: Props) {
  const results = await Promise.allSettled([
    apiFetch<PagedResult<Animes>>(
      `/anime?SortDesc=true&Page=1&PageSize=30&SortBy=${AnimeSortBy.Score}&Season=${currentSeason}&Year=${currentYear}`,
    ),
    apiFetch<PagedResult<Animes>>(
      `/anime?SortDesc=true&Page=1&PageSize=18&SortBy=${AnimeSortBy.UpdatedAt}`,
    ),
    apiFetch<PagedResult<Animes>>(
      `/anime?SortDesc=true&Page=1&PageSize=18&SortBy=${AnimeSortBy.CreatedAt}`,
    ),
  ]);

  return results.map((result) =>
    result.status === "fulfilled" ? result.value : null,
  );
}
