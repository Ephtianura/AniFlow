using AnimeApp.Application.Dto.Anime;
using AnimeApp.Core.Enums;
using AnimeApplication.Core.Enums;
using System.Text.Json;

namespace AnimeApp.API.Dto
{
    public record AnimeCreateJsonRequest(
        AnimeTitleRequest TitlesJson,   
        int? StudiosId,
        List<int>? GenresId,
        DateTime? AiredOn,
        DateTime? ReleasedOn,
        AnimeKindEnum Kind,
        AnimeStatusEnum Status,
        AnimeRatingEnum Rating,
        SeasonEnum Season,
        int Year,
        double Score,
        int Episodes,
        int EpisodesAired,
        int Duration,
        string Description
);

}