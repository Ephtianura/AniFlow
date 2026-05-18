using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.External
{
    public record AnimeFullRaw(
        int MalId,
        int? MoonId,
        int? AniListId,

        List<CompanyDto>? Companies,
        List<GenreRawDto>? Genres,

        DateTime? AiredOn, // Дата першої серії
        DateTime? ReleasedOn, // Дата останньої серії
        int? EpisodesAired, // Скільки вже вийшло епізодів 
        int? Episodes, // Всього епізодів

        string? DescriptionUa,
        string? DescriptionEn,
        string? Kind, // tv, movie

        string? TitleUa, // "Діти улюблениці"
        string? TitleEn,
        string? TitleJa,

        List<string>? Synonyms,
        List<string>? ScreenshotUrls,

        int? Duration,
        string? PosterUrl,
        string? Status, // "finished"
        string? Source, // "manga", "ranobe"
        string? Rating, // "pg_13"
        double? Score, // 9.73
        string? Season, // "spring", "winter"
        int? Year,
        bool Nsfw,
        string? Slug, // "oshi-no-ko-421060"

        List<ExternalLink>? External,
        List<VideoDto>? Videos,
        List<OstDto>? Osts
    );

    public record CompanyDto(
        string Type,
        string Name,
        string? Image,
        string? Slug
    );
    public record GenreRawDto(
        string? NameUa,
        string? NameEn,
        string? Slug,
        string? Type
    );

    public record VideoDto(
        string VideoUrl,
        string Title,
        string? Description,
        string? VideoType
    );
    public record OstDto(
        string Title,
        string? Author,
        string? SpotifyUrl,
        string? OstType,
        int? Index
    );
}