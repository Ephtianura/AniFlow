namespace AnimeApp.Application.Dto.External
{
    public record EpisodeRecent(
        DateTime DatePublished,
        int MoonId,
        int? MalId
    );
}