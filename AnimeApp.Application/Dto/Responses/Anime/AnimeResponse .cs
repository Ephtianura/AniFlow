using AnimeApp.Application.Dto.Responses.Studio;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Dto.Responses.Anime
{
    public class AnimeResponse
    {
        public int Id { get; set; }
        public int? MalId { get; set; }
        public string Url { get; set; } = null!;
        public List<TitleResponse>? Titles { get; set; } = [];
        public DateTime? AiredOn { get; set; }
        public DateTime? ReleasedOn { get; set; }
        public double Score { get; set; }
        public int TotalScores { get; set; }
        public int? Episodes { get; set; }
        public int? EpisodesAired { get; set; }
        public int? Duration { get; set; }
        public SeasonEnum? Season { get; set; }
        public int? Year { get; set; }
        public bool Nsfw { get; set; }
        public AnimeRatingEnum? Rating { get; set; }
        public AnimeKindEnum? Kind { get; set; }
        public AnimeStatusEnum? Status { get; set; }
        public AnimeSource? Source { get; set; }
        public string? Description { get; set; }
        public string? PosterUrl { get; set; }
        public List<string>? ScreenshotsUrls { get; set; } = [];
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<AnimeOst> Music { get; set; } = [];
        public List<AnimeVideo> Promos { get; set; } = [];
        public List<ExternalLink> ExternalLinks { get; set; } = [];
        public StudioAnimeResponse? Studio { get; set; }
        public List<GenreResponse>? Genres { get; set; } = [];
        public List<AnimeRelatedResponse>? Relateds { get; set; } = [];
    }
}
