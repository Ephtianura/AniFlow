using AnimeApp.Core.Enums;
using System.Globalization;

namespace AnimeApp.Core.Contracts
{
    public class AdminAnimeStatsDto
    {
        public int TotalAnimeCount { get; set; }
        public int TotalGenresCount { get; set; }
        public int TotalStudiosCount { get; set; }
        public int NsfwCount { get; set; }
        public double GlobalAvgScore { get; set; }
        public int TotalEpisodesAired { get; set; }

        public List<YearStatItem> ByYear { get; set; } = [];
        public List<SeasonStatItem> BySeason { get; set; } = [];
        public List<GenreStatItem> ByGenre { get; set; } = [];
        public List<GenreAvgScoreItem> AvgScoreByGenre { get; set; } = [];
        public List<StatusStatItem> ByStatus { get; set; } = [];
        public List<KindStatItem> ByKind { get; set; } = [];
        public List<TopAnimeItem> TopAnime { get; set; } = [];
        public List<StudioStatItem> ByStudio { get; set; } = [];
        public List<EpisodeRangeItem> ByEpisodes { get; set; } = [];
    }

    public record YearStatItem(int? Year, int Count);
    public record SeasonStatItem(SeasonEnum Season, int Count);
    public record StatusStatItem(AnimeStatusEnum Status, int Count);
    public record KindStatItem(AnimeKindEnum Kind, int Count);

    public record GenreStatItem(string Name, string Slug, int Count);
    public record GenreAvgScoreItem(string Name, string Slug, double AvgScore);
    public record TopAnimeItem(int Id, string Url, string UkrainianTitle, double Score);
    public record StudioStatItem(string Studio, string Slug, int Count);
    public record EpisodeRangeItem(string Range, int Count);
}
