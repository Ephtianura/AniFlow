namespace AnimeApp.Application.Dto.External
{

    public record AnimeIdList
    (
        List<AnimeIdDto> AnimeList,
        int LastPage
    );

    public record AnimeIdDto
    (
        int MoonId,
        int? MalIdx,
        int? AnilistIdx
    );
}
