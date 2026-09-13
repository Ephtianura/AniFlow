namespace AnimeApp.Core.Dto
{
    public record AnimeSitemapRawResponse(
        string Title,
        string? PosterFileName,
        string Url,
        DateTime UpdatedAt
    );
}
