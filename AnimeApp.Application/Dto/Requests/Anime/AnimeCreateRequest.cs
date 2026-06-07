using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Requests.Anime
{
    public class AnimeCreateRequest
    {
        // =================== Titles ===================
        public List<AnimeTitleRequest> Titles { get; set; } = [];

        // =================== Studio / Genres ===================
        public int? StudiosId { get; set; }
        public List<int>? GenresIds { get; set; }

        // =================== Dates ===================

        public DateTime? AiredOn { get; set; }
        public DateTime? ReleasedOn { get; set; }

        // =================== Rating / Kind / Status / Source ===================

        public AnimeKindEnum? Kind { get; set; }
        public AnimeStatusEnum? Status { get; set; }
        public AnimeRatingEnum? Rating { get; set; }
        public AnimeSource? Source { get; set; }

        // =================== Statistics ===================

        public double Score { get; set; } 
        public int? Episodes { get; set; }
        public int? EpisodesAired { get; set; }
        public int? Duration { get; set; }
        public bool Nsfw { get; set; }

        // =================== Description ===================

        public string? Description { get; set; } 
    }
}
