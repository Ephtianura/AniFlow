using AnimeApp.Application.Contracts;
using AnimeApp.Core.Contracts;
using StackExchange.Redis;

namespace AnimeApp.Application.Services
{
    public class StatsService(IStatsRepository statsRepository, IConnectionMultiplexer redisConnection) : IStatsService
    {
        private readonly IStatsRepository _statsRepository = statsRepository;
        private readonly IDatabase _redis = redisConnection.GetDatabase();
        private readonly IConnectionMultiplexer _redisConnection = redisConnection;

        public async Task<DashboardPulseDto> GetLivePulseAsync()
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var currentSecond = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            // RPS 
            var rpsRaw = await _redis.StringGetAsync($"metrics:rps:{currentSecond}");
            int rps = rpsRaw.HasValue ? int.Parse(rpsRaw) : 0;

            // O(1)
            long activeUsersCount = await _redis.HashLengthAsync("metrics:online:active_users");
            long activeGuestsCount = await _redis.HashLengthAsync("metrics:online:active_guests");
            int activeUsersNow = (int)(activeUsersCount + activeGuestsCount);

            // Визиты
            var visitsRaw = await _redis.StringGetAsync($"metrics:visits:{today}");
            int visitsToday = visitsRaw.HasValue ? int.Parse(visitsRaw) : 0;

            // Уникальные (HyperLogLog)
            var uniquesCount = await _redis.HyperLogLogLengthAsync($"metrics:uniques:{today}");
            int uniquesToday = (int)uniquesCount;

            // Просмотры
            var viewsRaw = await _redis.StringGetAsync($"metrics:views:{today}");
            int viewsToday = viewsRaw.HasValue ? int.Parse(viewsRaw) : 0;

            // Пиковый онлайн
            var peakRaw = await _redis.StringGetAsync($"metrics:online:peak:{today}");
            int peakOnline = peakRaw.HasValue ? int.Parse(peakRaw) : 0;

            // Средний онлайн
            var sumRaw = await _redis.StringGetAsync($"metrics:online:sum:{today}");
            var ticksRaw = await _redis.StringGetAsync($"metrics:online:ticks:{today}");
            int avgOnline = 0;
            if (sumRaw.HasValue && ticksRaw.HasValue && int.Parse(ticksRaw) > 0)
            {
                avgOnline = int.Parse(sumRaw) / int.Parse(ticksRaw);
            }

            // Если текущий онлайн прямо сейчас физически перерос пиковый в базе, подменяем «на лету»
            if (activeUsersNow > peakOnline) peakOnline = activeUsersNow;

            return await _statsRepository.GetSystemPulseDataAsync(
                activeUsersNow, rps, visitsToday, uniquesToday, viewsToday, peakOnline, avgOnline);
        }
        public async Task FlushDailyGlobalStatsAsync()
        {
            var todayStr = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var todayDate = DateTime.UtcNow.Date;

            var visits = await _redis.StringGetAsync($"metrics:visits:{todayStr}");
            var uniques = await _redis.HyperLogLogLengthAsync($"metrics:uniques:{todayStr}");
            var views = await _redis.StringGetAsync($"metrics:views:{todayStr}");
            var peak = await _redis.StringGetAsync($"metrics:online:peak:{todayStr}");
            var sum = await _redis.StringGetAsync($"metrics:online:sum:{todayStr}");
            var ticks = await _redis.StringGetAsync($"metrics:online:ticks:{todayStr}");

            int avgOnline = 0;
            if (sum.HasValue && ticks.HasValue && int.Parse(ticks) > 0)
            {
                avgOnline = int.Parse(sum) / int.Parse(ticks);
            }

            await _statsRepository.SaveDailyAggregatedStatsAsync(
                todayDate,
                visits.HasValue ? int.Parse(visits) : 0,
                (int)uniques,
                views.HasValue ? int.Parse(views) : 0,
                peak.HasValue ? int.Parse(peak) : 0,
                avgOnline
            );

            var expireTime = TimeSpan.FromHours(2);
            await _redis.KeyExpireAsync($"metrics:visits:{todayStr}", expireTime);
            await _redis.KeyExpireAsync($"metrics:uniques:{todayStr}", expireTime);
            await _redis.KeyExpireAsync($"metrics:views:{todayStr}", expireTime);
            await _redis.KeyExpireAsync($"metrics:online:peak:{todayStr}", expireTime);
            await _redis.KeyExpireAsync($"metrics:online:sum:{todayStr}", expireTime);
            await _redis.KeyExpireAsync($"metrics:online:ticks:{todayStr}", expireTime);
        }

        public async Task FlushDailyAnimeEpisodeStatsAsync()
        {
            var todayStr = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var todayDate = DateTime.UtcNow.Date;
            var episodesViewsKey = $"metrics:anime:episodes:views:{todayStr}";

            var entries = await _redis.SortedSetRangeByRankWithScoresAsync(episodesViewsKey, 0, -1);

            if (entries.Length > 0)
            {
                var episodeViewsList = new List<EpisodeViewData>();

                foreach (var entry in entries)
                {
                    string[] parts = entry.Element!.ToString().Split(':');
                    if (parts.Length == 2 && int.TryParse(parts[0], out int animeId) && int.TryParse(parts[1], out int episodeNum))
                    {
                        int viewsCount = (int)entry.Score;
                        episodeViewsList.Add(new EpisodeViewData(animeId, episodeNum, viewsCount));
                    }
                }

                await _statsRepository.SaveEpisodeViewsMetricsAsync(todayDate, episodeViewsList);
            }

            var expireTime = TimeSpan.FromHours(2);
            await _redis.KeyExpireAsync(episodesViewsKey, expireTime);
        }

        public Task<List<AnimeTopDto>> GetTopAnimeByViewsAsync(DateTime startDate, DateTime endDate, int limit = 10) =>
            _statsRepository.GetTopAnimeByViewsAsync(startDate, endDate, limit);
         

    }
}
