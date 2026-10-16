import { AdminDashboardStatsDto, UserListsStatsDto } from "@/core/stats";
import { apiFetch } from "@/lib/api";
import AnimeStatistic from "./AnimeStatistic";
import { headers } from "next/headers";

export const metadata = {
    title: "Статистика аніме | AniFlow"
}

const DEFAULT_ANIME_STATS: AdminDashboardStatsDto = {
    totalAnimeCount: 0,
    totalGenresCount: 0,
    totalStudiosCount: 0,
    nsfwCount: 0,
    globalAvgScore: 0,
    totalEpisodesAired: 0,
    byYear: [],
    bySeason: [],
    byGenre: [],
    avgScoreByGenre: [],
    byStatus: [],
    byKind: [],
    topAnime: [],
    byStudio: [],
    byEpisodes: []
};
const DEFAULT_USER_LIST_STATS: UserListsStatsDto = {
    totalFavoritesCount: 0,
    totalRatedCount: 0,
    byListType: []
};

export default async function AnimeStatisticPage() {
    let animeStats = DEFAULT_ANIME_STATS;
    let userListStats = DEFAULT_USER_LIST_STATS;

        const cookieHeader = (await headers()).get("cookie") ?? "";


    try {
        animeStats = await apiFetch<AdminDashboardStatsDto>("/stats/anime-dashboard",{cookieHeader});
    }
    catch (err: any) {
        console.error("Помилка завантаження аніме статистики:", err);
    }

    try {
        userListStats = await apiFetch<UserListsStatsDto>("/stats/user-lists",{cookieHeader});
    }
    catch (err: any) {
        console.error("Помилка завантаження статистики користувачів:", err);
    }

    return (
        <AnimeStatistic
            animeStats={animeStats}
            userListStats={userListStats}
        />
    );
}