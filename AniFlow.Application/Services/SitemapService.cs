using AniFlow.Application.Contracts.App;
using AniFlow.Application.Contracts.Infra;
using AniFlow.Application.Dto.Responses.Anime;
using AniFlow.DataAccess.Repositories;
using Microsoft.Extensions.Logging;

namespace AniFlow.Application.Services
{
    public class SitemapService(
        ISitemapRepository sitemap,
        IS3FileStorageService fileStorage,
        ILogger<SitemapService> logger) : ISitemapService
    {
        private readonly ISitemapRepository _sitemapRep = sitemap;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly ILogger<SitemapService> _logger = logger;

        public async Task<List<AnimeSitemapResponse>> GetAllAnime()
        {
            var anime = await _sitemapRep.GetAllAnime();

            return anime.ConvertAll(a => new AnimeSitemapResponse(
                a.Title,
                GetPosterUrl(a.PosterFileName),
                a.Url,
                a.UpdatedAt
                ));
        }

        private string? GetPosterUrl(string? posterFileName) =>
            string.IsNullOrWhiteSpace(posterFileName)
                ? null
                : _fileStorage.GetUrl(posterFileName);
    }
}
