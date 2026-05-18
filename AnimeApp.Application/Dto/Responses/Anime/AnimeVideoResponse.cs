using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Responses.Anime
{
    public record AnimeVideoResponse(
        int Id,
        string Url,
        VideoKind Kind,
        int Index
    );
}