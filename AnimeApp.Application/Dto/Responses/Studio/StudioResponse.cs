using AnimeApp.Application.Dto.Responses.Anime;

namespace AnimeApp.Application.Dto.Responses.Studio
{
    public record StudioResponse(
    int Id = 0,
    string Name = "",
    string Description = "",
    string? PosterUrl = null,
    List<AnimesResponse> Animes = null!
);
}
