using Microsoft.AspNetCore.Http;

namespace AnimeApp.Application.Dto.Anime
{
    public record AnimeUpdateFilesRequest(
         IFormFile? Poster,
         List<IFormFile>? Screenshots,
         string? PosterUrl,               
         List<string>? ScreenshotUrls
    );
}
