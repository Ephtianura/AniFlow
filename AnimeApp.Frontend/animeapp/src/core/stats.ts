import { AnimeKindEnum } from "./enums/AnimeKind";
import { AnimeStatusEnum } from "./enums/AnimeStatus";
import { MyListEnum } from "./enums/MyList";
import { SeasonEnum } from "./enums/Season";

export interface YearStatItem { year: number | null; count: number; }
export interface SeasonStatItem { season: SeasonEnum; count: number; }
export interface StatusStatItem { status: AnimeStatusEnum; count: number; }
export interface KindStatItem { kind: AnimeKindEnum; count: number; }
export interface GenreStatItem { name: string; slug: string; count: number; }
export interface GenreAvgScoreItem { name: string; slug: string; avgScore: number; }
export interface TopAnimeItem { id: number; url: string; ukrainianTitle: string; score: number; }
export interface StudioStatItem { studio: string; slug: string; count: number; }
export interface EpisodeRangeItem { range: string; count: number; }

export interface AdminDashboardStatsDto {
    totalAnimeCount: number;
    totalGenresCount: number;
    totalStudiosCount: number;
    nsfwCount: number;
    globalAvgScore: number;
    totalEpisodesAired: number;

    byYear: YearStatItem[];
    bySeason: SeasonStatItem[];
    byGenre: GenreStatItem[];
    avgScoreByGenre: GenreAvgScoreItem[];
    byStatus: StatusStatItem[];
    byKind: KindStatItem[];
    topAnime: TopAnimeItem[];
    byStudio: StudioStatItem[];
    byEpisodes: EpisodeRangeItem[];
}

export interface UserListTypeStatItem { listType: MyListEnum; count: number; }

export interface UserListsStatsDto {
    totalFavoritesCount: number;
    totalRatedCount: number;
    byListType: UserListTypeStatItem[];
}