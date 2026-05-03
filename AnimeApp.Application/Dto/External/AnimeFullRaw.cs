namespace AnimeApp.Application.Dto.External
{
    public record AnimeFullRaw(
        int MalId,
        int? AnilistId,

        List<CompanyDto>? Companies,
        List<GenreDto>? Genres,

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

        List<ExternalLinkDto>? External,
        List<VideoDto>? Videos,
        List<OstDto>? Ost
    );

    public record CompanyDto(
        string? Type,
        string? Image,
        string? Slug,
        string? Name
    );
    public record GenreDto(
        string? NameUa,
        string? NameEn,
        string? Slug,
        string? Type
    );
    public record ExternalLinkDto(
        string? Url,
        string? Text,
        string? Type
    );

    public record VideoDto(
        string? VideoUrl,
        string? Title,
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

    // Создать AnimeMediaContent.Music из OstDto, попытаться сконектить туда VideoDto.VideoType = music,
    // если не получается и всё остальное кидаем в Promos
    public class AnimeMediaContent
    {
        public List<AnimeOst> Music { get; set; } = [];
        public List<VideoVersion> Promos { get; set; } = [];
    }

    public class AnimeOst
    {
        public int Id { get; set; }
        public int AnimeId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? Author { get; set; }
        public OstType Type { get; set; } // Opening / Ending / Other
        public string? SpotifyUrl { get; set; }
        public int Index { get; set; } // Порядок відображення пісень

        // Відео конкретно цієї пісні
        public List<VideoVersion> Videos { get; set; } = [];

    }
    public class VideoVersion
    {
        public VideoKind Kind { get; set; }
        public string Url { get; set; } = null!;
        public int Index { get; set; } // Порядок всередені AnimeOst
    }

    public enum OstType
    {
        Opening,
        Ending,
        Insert,
        Other
    }

    public enum VideoKind
    {   

        Other = 0,

        // Музикальні типи
        AnimeVersion = 1,       // (TV-Size)
        ArtistVersion = 2,      // (Full)
        Live = 3,               // Концерт

        // Короткі промо/трейлери
        Promo = 10,              // PV
        Trailer = 11,
        Teaser = 12,
        Commercial = 13,         // CM
    }

}