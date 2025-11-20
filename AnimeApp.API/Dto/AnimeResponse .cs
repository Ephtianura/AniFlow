using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;
using AnimeApplication.Core.Enums;

namespace AnimeApp.API.Dto
{
    public record AnimeResponse(
    int Id = 0,
    List<AnimeTitle>? Titles = null,
    DateTime? AiredOn = null,
    DateTime? ReleasedOn = null,
    double Score = 0,
    int Episodes = 0,
    int EpisodesAired = 0,
    int Duration = 0,
    SeasonEnum Season = SeasonEnum.Unknown,
    int Year = 0,
    AnimeRatingEnum Rating = AnimeRatingEnum.Unknown,
    AnimeKindEnum Kind = AnimeKindEnum.Unknown,
    AnimeStatusEnum Status = AnimeStatusEnum.Unknown,
    string Description = "",
    string? PosterUrl = null,
    List<string>? ScreenshotsUrls = null,
    string Url = "",
    StudioInAnimeResponse? Studio = null,
    List<Genre>? Genres = null,
    List<AnimesResponse>? Relateds = null
);

}
