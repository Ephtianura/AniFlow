using AnimeApp.Core.Contracts;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;
using EFCore.BulkExtensions;
using Microsoft.EntityFrameworkCore;
namespace AnimeApp.DataAccess.Repositories
{ 
    public class StatsRepository(AnimeAppDbContext context) : IStatsRepository
    {
        private readonly AnimeAppDbContext _dbCcontext = context;

        public async Task<AdminAnimeStatsDto> GetAdminAnimeStatsAsync()
        {
            var rawData = await _dbCcontext.Animes
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
                return new AdminAnimeStatsDto();
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

            return new AdminAnimeStatsDto
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


        public async Task<DashboardPulseDto> GetSystemPulseDataAsync(int activeUsersNow, int rps, int visitsToday, int uniquesToday,
            int viewsToday, int peakOnline, int avgOnline)
        {
            var today = DateTime.UtcNow.Date;
            var weekAgo = today.AddDays(-7);

            var totalUsers = await _dbCcontext.Users.CountAsync();
            var totalAnime = await _dbCcontext.Animes.CountAsync();

            var regsToday = await _dbCcontext.Users.CountAsync(u => u.DateOfRegistration >= today);
            var interactionsToday = await _dbCcontext.UserAnimes.CountAsync(ua => ua.UpdatedAt >= today);

            var history = await _dbCcontext.DailySystemStat
                .Where(s => s.Date >= weekAgo && s.Date < today)
                .OrderBy(s => s.Date)
                .ToListAsync();

            var regChart = history.Select(h => new ChartPointDto { Date = h.Date.ToString("dd.MM"), Value = h.RegistrationsCount }).ToList();
            regChart.Add(new ChartPointDto { Date = "Сьогодні", Value = regsToday });

            var interactionChart = history.Select(h => new ChartPointDto { Date = h.Date.ToString("dd.MM"), Value = h.UserInteractionsCount }).ToList();
            interactionChart.Add(new ChartPointDto { Date = "Сьогодні", Value = interactionsToday });

            var visitChart = history.Select(h => new ChartPointDto { Date = h.Date.ToString("dd.MM"), Value = h.VisitsCount }).ToList();
            visitChart.Add(new ChartPointDto { Date = "Сьогодні", Value = visitsToday });

            var viewChart = history.Select(h => new ChartPointDto { Date = h.Date.ToString("dd.MM"), Value = h.PlayerViewsCount }).ToList();
            viewChart.Add(new ChartPointDto { Date = "Сьогодні", Value = viewsToday });

            var regsWeek = history.Sum(h => h.RegistrationsCount) + regsToday;
            var interactionsWeek = history.Sum(h => h.UserInteractionsCount) + interactionsToday;
            var visitsWeek = history.Sum(h => h.VisitsCount) + visitsToday;
            var viewsWeek = history.Sum(h => h.PlayerViewsCount) + viewsToday;

            var recentAnimeList = await _dbCcontext.Animes
                .OrderByDescending(a => a.Id)
                .Take(5)
                .Select(a => new RecentAnimeItemDto
                {
                    Name = a.Titles.Where(t => t.Language == TitleLanguage.Ukrainian && t.Type == TitleType.Official).Select(t => t.Value).FirstOrDefault() ?? a.Url,
                    Url = a.Url,
                    CreatedAt = a.CreatedAt.ToString() 
                }).ToListAsync();

            return new DashboardPulseDto
            {
                TotalUsers = totalUsers,
                TotalAnime = totalAnime,
                ActiveUsersNow = activeUsersNow,
                CurrentRps = rps,
                PeakOnlineToday = peakOnline,
                AvgOnlineToday = avgOnline,

                Registrations = new StatBlockDto { Label = "Реєстрації", CountToday = regsToday, CountWeek = regsWeek, ChartData = regChart },
                UserInteractions = new StatBlockDto { Label = "Взаємодії", CountToday = interactionsToday, CountWeek = interactionsWeek, ChartData = interactionChart },
                Visits = new StatBlockDto { Label = "Відвідування сайту", CountToday = visitsToday, CountWeek = visitsWeek, ChartData = visitChart },
                PlayerViews = new StatBlockDto { Label = "Перегляди в плеєрі", CountToday = viewsToday, CountWeek = viewsWeek, ChartData = viewChart },
                RecentAnime = recentAnimeList
            };
        }

        public async Task SaveDailyAggregatedStatsAsync(DateTime date, int visits, int uniques, int views, int peakOnline, int avgOnline)
        {
            var registrations = await _dbCcontext.Users.CountAsync(u => u.DateOfRegistration >= date);
            var interactions = await _dbCcontext.UserAnimes.CountAsync(ua => ua.UpdatedAt >= date);

            var dailyStat = new DailySystemStat
            {
                Date = date,
                VisitsCount = visits,
                UniquesCount = uniques,
                RegistrationsCount = registrations,
                UserInteractionsCount = interactions,
                PlayerViewsCount = views,
                PeakOnline = peakOnline,
                AvgOnline = avgOnline
            };

            _dbCcontext.DailySystemStat.Add(dailyStat);
            await _dbCcontext.SaveChangesAsync();
        }

        public async Task SaveEpisodeViewsMetricsAsync(DateTime date, List<EpisodeViewData> episodeViewsList)
        {
            if (episodeViewsList == null || !episodeViewsList.Any()) return;

            var entities = episodeViewsList.Select(item => new AnimeDailyStats
            {
                Date = date.Date,
                AnimeId = item.AnimeId,
                EpisodeNumber = item.EpisodeNumber,
                ViewsCount = item.ViewsCount
            }).ToList();

            var bulkConfig = new BulkConfig
            {
                UpdateByProperties = [nameof(AnimeDailyStats.Date), nameof(AnimeDailyStats.AnimeId), nameof(AnimeDailyStats.EpisodeNumber)]
            };

            await _dbCcontext.BulkInsertOrUpdateAsync(entities, bulkConfig);
        }

        public async Task<List<AnimeTopDto>> GetTopAnimeByViewsAsync(DateTime startDate, DateTime endDate, int limit = 10)
        {
            return await _dbCcontext.AnimeDailyStats
                .Where(s => s.Date >= startDate.Date && s.Date <= endDate.Date)
                .GroupBy(s => s.AnimeId)
                .Select(g => new
                {
                    AnimeId = g.Key,
                    TotalViews = g.Sum(x => x.ViewsCount)
                })
                .Join(_dbCcontext.Animes,
                    stat => stat.AnimeId,
                    anime => anime.Id,
                    (stat, anime) => new AnimeTopDto
                    {
                        AnimeId = stat.AnimeId,
                        Title = anime.Titles
                            .Where(t => t.Language == TitleLanguage.Ukrainian && t.Type == TitleType.Official)
                            .Select(t => t.Value).FirstOrDefault() ?? anime.Url,
                        Slug = anime.Url,
                        TotalViews = stat.TotalViews
                    })
                .OrderByDescending(x => x.TotalViews)
                .Take(limit)
                .ToListAsync();
        }   
    }
}
