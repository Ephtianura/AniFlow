namespace AnimeApp.Application.Dto.External
{

    public record AnimeIdList
    (
        List<AnimeIdDto> AnimeIds,
        int LastPage
    );

    public record AnimeIdDto
    (
        int MoonId,
        int? MalId,
        int? AnilistId
    );
}
