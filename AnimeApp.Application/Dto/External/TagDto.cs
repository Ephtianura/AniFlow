namespace AnimeApp.Application.Dto.External
{
    public record TagsDto(
        List<TagDto> Genres,
        List<TagDto> Themes,
        List<TagDto> Demographics
    );
    public record TagDto(
        string NameEn,
        string NameUa,
        string Slug
    );
}