using AnimeApp.Core.Models;

namespace AnimeApp.API.Dto
{
    public record StudioResponse(
    int Id = 0,
    string Name = "",
    string Description = "",
    string? PosterUrl = null,
    List<AnimesResponse> Animes = null!
);




}
