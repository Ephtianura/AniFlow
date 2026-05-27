import { AnimeSortBy } from "@/core/enums/AnimeSortBy";
import { SeasonEnum } from "@/core/enums/Season";
import { Animes, PagedResult } from "@/core/types";
import { apiFetch } from "@/lib/api";

type Props = {
  currentYear: number;
  currentSeason: SeasonEnum;
};

export async function getHomeAnimes({ currentYear, currentSeason }: Props) {
  const seasonAnimesPromise = apiFetch<PagedResult<Animes>>(
    `/anime?SortDesc=true&Page=1&PageSize=30&SortBy=${AnimeSortBy.Score}&Season=${currentSeason}&Year=${currentYear}`,
  );
  const updatedAnimesPromise = apiFetch<PagedResult<Animes>>(
    `/anime?SortDesc=true&Page=1&PageSize=18&SortBy=${AnimeSortBy.UpdatedAt}`,
  );
  const newAnimesPromise = apiFetch<PagedResult<Animes>>(
    `/anime?SortDesc=true&Page=1&PageSize=18&SortBy=${AnimeSortBy.CreatedAt}`,
  );

  const [seasonAnimes, updatedAnimes, newAnimes] = await Promise.all([
    seasonAnimesPromise,
    updatedAnimesPromise,
    newAnimesPromise,
  ]);

  return [seasonAnimes, updatedAnimes, newAnimes];
}
