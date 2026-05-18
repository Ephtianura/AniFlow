using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Models
{
    public class CreateAnimeParams
    {
        public required List<AnimeTitle> Titles { get; init; }
        public required string Url { get; init; }

        public AnimeKindEnum? Kind { get; init; }
        public AnimeStatusEnum? Status { get; init; }
        public AnimeRatingEnum? Rating { get; init; }

        public string? Description { get; init; } 
        public string? PosterFileName { get; init; }

        public Studio? Studio { get; init; }
        public List<Genre>? Genres { get; init; }
        public List<string>? Screenshots { get; init; }

        public DateTime? AiredOn { get; init; }
        public DateTime? ReleasedOn { get; init; }
        public SeasonEnum? Season { get; init; }
        public int? Year { get; init; }

        public double? Score { get; init; }
        public int? Episodes { get; init; }
        public int? EpisodesAired { get; init; }
        public int? Duration { get; init; }
        public bool Nsfw { get; init; }
    }
}
