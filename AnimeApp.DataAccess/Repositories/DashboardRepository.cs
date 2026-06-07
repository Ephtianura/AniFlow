using AnimeApp.Core.Contracts;
using AnimeApp.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace AnimeApp.DataAccess.Repositories
{
    public class DashboardRepository(AnimeAppDbContext context) : IDashboardRepository
    {
        private readonly AnimeAppDbContext _context = context;

        public async Task<AdminDashboardStatsDto> GetAdminDashboardStatsAsync()
        {
            var rawData = await _context.Animes
                .Select(a => new
                {
                    a.Id,
                    a.Year,
                    a.Season,
                    a.Status,
                    a.Kind,
                    a.Score,
                    a.Nsfw,
                    a.Episodes,
                    a.EpisodesAired,
                    a.Url,
                    Studio = a.Studio == null ? null : new
                    {
                        a.Studio.Name,
                        a.Studio.Slug
                    },
                    UkTitle = a.Titles
                        .Where(t => t.Language == TitleLanguage.Ukrainian && t.Type == TitleType.Official)
                        .Select(t => t.Value)
                        .FirstOrDefault() ?? "¯\\_(ツ)_/¯",
                    Genres = a.Genres.Select(g => new { g.NameUa, g.NameEn, g.Slug }).ToList()
                })
                .AsNoTracking()
                .ToListAsync();

            if (!rawData.Any())
            {
                return new AdminDashboardStatsDto();
            }

            var totalAnime = rawData.Count;
            var globalAvgScore = rawData.Average(a => a.Score);
            var nsfwCount = rawData.Count(a => a.Nsfw);
            var totalEpisodes = rawData.Sum(a => a.EpisodesAired ?? 0);
            var uniqueStudiosCount = rawData
                .Where(a => a.Studio != null)
                .Select(a => a.Studio!.Slug)
                .Distinct()
                .Count();
            var uniqueGenresCount = rawData.SelectMany(a => a.Genres).Distinct().Count();

            var byYear = rawData
                .GroupBy(a => a.Year)
                .Select(g => new YearStatItem(g.Key, g.Count()))
                .OrderBy(g => g.Year)
                .ToList();
            var bySeason = rawData
               .Where(a => a.Season != null)
               .GroupBy(a => a.Season)
               .Select(g => new SeasonStatItem(g.Key!.Value, g.Count()))
               .ToList();
            var flatGenres = rawData
              .SelectMany(a => a.Genres.Select(g => new { Genre = g, a.Score }))
              .ToList();
            var byGenre = flatGenres
                 .GroupBy(g => g.Genre)
                 .Select(g => new GenreStatItem(g.Key.NameUa ?? g.Key.NameEn, g.Key.Slug, g.Count()))
                 .OrderByDescending(g => g.Count)
                 .ToList();
            var avgScoreByGenre = flatGenres
                   .GroupBy(g => g.Genre)
                   .Select(g => new GenreAvgScoreItem(g.Key.NameUa ?? g.Key.NameEn, g.Key.Slug, Math.Round(g.Average(x => x.Score), 2)))
                   .OrderByDescending(g => g.AvgScore)
                   .ToList();
            var byStatus = rawData
                    .Where(a => a.Status.HasValue)
                    .GroupBy(a => a.Status!.Value)
                    .Select(g => new StatusStatItem(g.Key, g.Count()))
                    .ToList();
            var byKind = rawData
                    .Where(a => a.Kind.HasValue)
                    .GroupBy(a => a.Kind!.Value)
                    .Select(g => new KindStatItem(g.Key, g.Count()))
                    .ToList();
            var topAnime = rawData
                .OrderByDescending(a => a.Score)
                .Take(10)
                .Select(a => new TopAnimeItem(a.Id, a.Url, a.UkTitle, a.Score))
                .ToList();
            var byStudio = rawData
              .Where(a => a.Studio != null)
              .GroupBy(a => new { a.Studio!.Name, a.Studio!.Slug })
              .Select(g => new StudioStatItem(g.Key.Name, g.Key.Slug, g.Count()))
              .OrderByDescending(g => g.Count)
              .Take(20)
              .ToList();
            var byEpisodes = rawData
                .Where(a => a.Episodes.HasValue)
                .GroupBy(a =>
                {
                    int eps = a.Episodes.Value;
                    int start = (eps / 5) * 5;
                    return $"{start}-{start + 4}";
                })
                .Where(g => g.Count() >= 2)
                .Select(g => new EpisodeRangeItem(g.Key, g.Count()))
                .OrderBy(g => int.Parse(g.Range.Split('-')[0]))
                .ToList();

            return new AdminDashboardStatsDto
            {
                TotalAnimeCount = totalAnime,
                TotalGenresCount = uniqueGenresCount,
                TotalStudiosCount = uniqueStudiosCount,
                NsfwCount = nsfwCount,
                GlobalAvgScore = Math.Round(globalAvgScore, 2),
                TotalEpisodesAired = totalEpisodes,

                ByYear = byYear,
                BySeason = bySeason,
                ByGenre = byGenre,
                AvgScoreByGenre = avgScoreByGenre,
                ByStatus = byStatus,
                ByKind = byKind,
                TopAnime = topAnime,
                ByStudio = byStudio,
                ByEpisodes = byEpisodes
            };
        }

    }
}
