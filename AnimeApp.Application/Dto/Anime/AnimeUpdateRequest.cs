using AnimeApp.Core.Enums;
using AnimeApplication.Core.Enums;
using Microsoft.AspNetCore.Http;

namespace AnimeApp.Application.Dto.Anime
{
    public record AnimeUpdateRequest(
         List<AnimeTitleRequest>? Titles, 

         int? StudiosId,
         List<int>? GenresId,

         DateTime? AiredOn,
         DateTime? ReleasedOn,

         AnimeKindEnum? Kind,
         AnimeStatusEnum? Status,
         AnimeRatingEnum? Rating, 
         SeasonEnum? Season,
         int? Year,

         double? Score,
         int? Episodes,
         int? EpisodesAired,
         int? Duration,

         string? Description
    );
}
