using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Contracts
{
    public record UserAnimeStatsData(
        MyListEnum? MyList,
        int? Rating,
        bool IsFavorite,
        int? AnimeEpisodes,
        int? AnimeDuration
);
}
