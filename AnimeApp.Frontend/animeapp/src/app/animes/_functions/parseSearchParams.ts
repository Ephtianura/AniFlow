import { AnimeKindEnum } from "@/core/enums/AnimeKind";
import { SearchParams } from "../page";
import { AnimeStatusEnum } from "@/core/enums/AnimeStatus";
import { SeasonEnum } from "@/core/enums/Season";
import { AnimeRatingEnum } from "@/core/enums/AnimeRating";
import { AnimeSortBy } from "@/core/enums/AnimeSortBy";
import { ViewMode } from "@/components/AnimeCard";

export function parseSearchParams(searchParams: URLSearchParams): SearchParams {
    return {
        search: searchParams.get("search") ?? undefined,
        genres: searchParams.get("genres") ?? undefined,
        studio: searchParams.get("studio") ?? undefined,

        kind: searchParams.get("kind") as AnimeKindEnum | undefined,
        status: searchParams.get("status") as AnimeStatusEnum | undefined,
        rating: searchParams.get("rating") as AnimeRatingEnum | undefined,

        season: searchParams.get("season") as SeasonEnum | undefined,

        year: searchParams.get("year") ?? undefined,

        airedFrom: searchParams.get("airedFrom") ?? undefined,
        airedTo: searchParams.get("airedTo") ?? undefined,

        releasedFrom: searchParams.get("releasedFrom") ?? undefined,
        releasedTo: searchParams.get("releasedTo") ?? undefined,

        minScore: searchParams.get("minScore") ?? undefined,
        maxScore: searchParams.get("maxScore") ?? undefined,

        minEpisodes: searchParams.get("minEpisodes") ?? undefined,
        maxEpisodes: searchParams.get("maxEpisodes") ?? undefined,

        sortBy: searchParams.get("sortBy") as AnimeSortBy | undefined,
        sortDesc: searchParams.get("sortDesc") ?? undefined,

        page: searchParams.get("page") ?? undefined,

        view: (searchParams.get("view") as ViewMode) || "list",
    };
}