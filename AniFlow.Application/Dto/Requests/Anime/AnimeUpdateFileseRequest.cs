using Microsoft.AspNetCore.Http;

namespace AniFlow.Application.Dto.Requests.Anime
{
    public record AnimeUpdateFilesRequest(
         IFormFile? Poster,
         List<IFormFile>? Screenshots,
         string? PosterUrl,
         List<string>? ScreenshotUrls
    );
}
