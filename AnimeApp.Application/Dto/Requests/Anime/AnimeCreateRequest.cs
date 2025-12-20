using AnimeApp.Core.Enums;
using Microsoft.AspNetCore.Http;

namespace AnimeApp.Application.Dto.Requests.Anime
{
    public class AnimeCreateRequest
    {

        public List<AnimeTitleRequest> Titles { get; set; } = new();

        // =================== Poster / Screens ===================

        public string? PosterUrl { get; set; }
        public List<string>? ScreenshotsUrls { get; set; }

        // =================== Studio / Genres ===================

        public int? StudiosId { get; set; }
        public List<int>? GenresId { get; set; }

        // =================== Dates ===================

        public DateTime? AiredOn { get; set; }
        public DateTime? ReleasedOn { get; set; }

        // =================== Rating / Kind / Status ===================

        public AnimeKindEnum Kind { get; set; } = AnimeKindEnum.Unknown;
        public AnimeStatusEnum Status { get; set; } = AnimeStatusEnum.Unknown;
        public AnimeRatingEnum Rating { get; set; } = AnimeRatingEnum.Unknown;

        // =================== Statistics ===================

        public double Score { get; set; } = 0;
        public int Episodes { get; set; } = 1;
        public int EpisodesAired { get; set; } = 0;
        public int Duration { get; set; } = 1;

        // =================== Description ===================

        public string Description { get; set; } = string.Empty;
    }
}
