namespace AnimeApp.Application.Dto.Responses.Anime
{
    public record AnimeSitemapResponse(
        string Title,
        string? PosterUrl,
        string Url,
        DateTime UpdatedAt
    );
}
