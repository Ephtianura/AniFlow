using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Requests.Anime
{
    public record AnimeUpdateRequest(
         List<AnimeTitleRequest>? Titles, 

         int? StudiosId,
         List<int>? GenresIds,

         DateTime? AiredOn,
         DateTime? ReleasedOn,

         AnimeKindEnum? Kind,
         AnimeStatusEnum? Status,
         AnimeRatingEnum? Rating, 
         AnimeSource? Source,

         double? Score,
         int? Episodes,
         int? EpisodesAired,
         int? Duration,

         string? Description,
         bool? Nsfw
    );
}
