using AniFlow.Core.Enums;

namespace AniFlow.Application.Dto.Responses.Anime
{
    public record AnimeVideoResponse(
        int Id,
        string Url,
        VideoKind Kind,
        int Index
    );
}