using AnimeApplication.Core.Enums;

namespace AnimeApp.Application.Dto.Anime
{
    public record RelatedsAnimeRequest
    (
        int RelatedAnimeId,
        RelationKindEnum RelationKind
    );
}