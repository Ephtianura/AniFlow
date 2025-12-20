using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Requests.Anime
{
    public record RelatedsAnimeRequest
    (
        int RelatedAnimeId,
        RelationKindEnum RelationKind
    );
}