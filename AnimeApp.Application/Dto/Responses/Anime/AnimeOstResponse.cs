using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Responses.Anime
{
    public record AnimeOstResponse(
        int Id,
        string Title,
        string? Description,
        string? Author,
        OstType Type,
        string? SpotifyUrl,
        int Index,
        List<AnimeVideoResponse> Videos
    );
}