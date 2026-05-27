import { SearchParams } from "../page";

export function buildApiQuery(
  resolvedParams: SearchParams,
  page: number = 1,
  pageSize: number = 20,
) {
  const apiQuery = new URLSearchParams();

  const map: Partial<Record<keyof SearchParams, string>> = {
    search: "search",
    genres: "genresSlugs",
    studio: "studioSlug",
    kind: "kind",
    status: "status",
    rating: "rating",
    season: "season",
    year: "year",
    minScore: "minScore",
    maxScore: "maxScore",
    minEpisodes: "minEpisodes",
    maxEpisodes: "maxEpisodes",
    airedFrom: "airedFrom",
    airedTo: "airedTo",
    releasedFrom: "releasedFrom",
    releasedTo: "releasedTo",
    sortBy: "sortBy",
    sortDesc: "sortDesc",
  };

  for (const key in map) {
    const value = resolvedParams[key as keyof SearchParams];

    if (value) {
      const apiKey = map[key as keyof SearchParams]!;

      if (
        key === "genres" &&
        typeof value === "string" &&
        value.includes(",")
      ) {
        const slugsArray = value.split(",");
        slugsArray.forEach((slug) => {
          apiQuery.append(apiKey, slug);
        });
      } else {
        apiQuery.set(apiKey, value);
      }

      if (
        key === "airedFrom" ||
        key === "airedTo" ||
        key === "releasedFrom" ||
        key === "releasedTo"
      ) {
        apiQuery.set(apiKey, toDateOnly(value));
        continue;
      }
    }
  }

  apiQuery.set("pageSize", pageSize.toString());
  apiQuery.set("page", page.toString());

  return apiQuery.toString();
}

function toDateOnly(value: string) {
  if (value.includes("-")) {
    return value.slice(0, 10);
  }

  if (/^\d{4}$/.test(value)) {
    return `${value}-01-01`;
  }

  return value;
}
