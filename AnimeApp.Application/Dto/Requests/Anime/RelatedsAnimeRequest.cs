using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Requests.Anime
{
    public record RelatedAnimeItem(
        int RelatedAnimeId,
        RelationKindEnum RelationKind
    );

    public record RelatedsAnimeRequest(
        List<RelatedAnimeItem> RelatedsAnimes
    );
}