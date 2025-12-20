using AnimeApp.Application.Dto.Responses.Studio;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Dto.Responses.Anime
{
    public class AnimeResponse
    {
        public int Id { get; set; } = 0;
        public List<TitleResponse>? Titles { get; set; } = new();
        public DateTime? AiredOn { get; set; } = null;
        public DateTime? ReleasedOn { get; set; } = null;
        public double Score { get; set; } = 0;
        public int TotalScores { get; set; } = 0;
        public int Episodes { get; set; } = 0;
        public int EpisodesAired { get; set; } = 0;
        public int Duration { get; set; } = 0;
        public SeasonEnum Season { get; set; } = SeasonEnum.Unknown;
        public int Year { get; set; } = 0;
        public AnimeRatingEnum Rating { get; set; } = AnimeRatingEnum.Unknown;
        public AnimeKindEnum Kind { get; set; } = AnimeKindEnum.Unknown;
        public AnimeStatusEnum Status { get; set; } = AnimeStatusEnum.Unknown;
        public string Description { get; set; } = string.Empty;
        public string? PosterUrl { get; set; } = null;
        public List<string>? ScreenshotsUrls { get; set; } = new();
        public string Url { get; set; } = string.Empty;
        public StudioInAnimeResponse? Studio { get; set; } = null;
        public List<GenreResponse>? Genres { get; set; } = new();
        public List<AnimeRelatedResponse>? Relateds { get; set; } = new();
    }
}
