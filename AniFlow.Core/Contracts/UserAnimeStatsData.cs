using AniFlow.Core.Enums;

namespace AniFlow.Core.Contracts
{
    public record UserAnimeStatsData(
        MyListEnum? MyList,
        int? Rating,
        bool IsFavorite,
        int? AnimeEpisodes,
        int? AnimeDuration
);
}
