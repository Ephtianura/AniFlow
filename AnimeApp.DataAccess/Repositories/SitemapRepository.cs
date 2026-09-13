using AnimeApp.Core.Dto;
using AnimeApp.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace AnimeApp.DataAccess.Repositories
{
    // ===================== Sitemap =====================
    public class SitemapRepository(AnimeAppDbContext db) : ISitemapRepository
    {
        private readonly AnimeAppDbContext _dbContext = db;

        public async Task<List<AnimeSitemapRawResponse>> GetAllAnime()
        {
            var animes = await _dbContext.Animes
                .OrderByDescending(a => a.UpdatedAt)
                .Select(a => new AnimeSitemapRawResponse(
                    a.Titles
                        .Where(t => t.Language == TitleLanguage.Ukrainian &&
                                    t.Type == TitleType.Official)
                        .Select(t => t.Value)
                        .FirstOrDefault()
                    ?? a.Titles
                        .Where(t => t.Language == TitleLanguage.English &&
                                    t.Type == TitleType.Official)
                        .Select(t => t.Value)
                        .FirstOrDefault()
                   ??
                        a.Titles
                        .Where(t => t.Language == TitleLanguage.Romaji &&
                                    t.Type == TitleType.Official)
                        .Select(t => t.Value)
                        .FirstOrDefault()
                    ?? string.Empty,

                    a.PosterFileName,
                    a.Url,
                    a.UpdatedAt
                ))
                .ToListAsync();

            return animes;
        }



    }
}

