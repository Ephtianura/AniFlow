using AniFlow.Application.Contracts.App;
using AniFlow.Application.Dto.External;
using AniFlow.Application.Dto.Responses.Anime;
using AniFlow.Core.Filters;
using AniFlow.Infrastructure.RedisCache.AniFlow.Core.Filters;

namespace AniFlow.Infrastructure.RedisCache
{
    public class AnimeQueryCacheDecorator(IRedisCache cache, IAnimeQueryService queryService) : IAnimeQueryService
    {
        private readonly IRedisCache _cache = cache;
        private readonly IAnimeQueryService _queryService = queryService;

        public async Task<AnimeResponse> GetByIdAsync(int id, CancellationToken ct)
        {
            var key = $"anime:id:{id}";

            var cached = await _cache.GetAsync<AnimeResponse>(key);

            if (cached != null)
                return cached;

            var anime = await _queryService.GetByIdAsync(id, ct);

            await _cache.SetAsync(key, anime, TimeSpan.FromMinutes(15));

            return anime;
        }

        public async Task<PagedResult<AnimesResponse>> GetFilteredAsync(AnimeFilter filter, CancellationToken ct)
        {
            var key = "anime:filter:" + filter.ToCacheKey();

            var cached = await _cache.GetAsync<PagedResult<AnimesResponse>>(key);
            if (cached != null)
                return cached;

            var animes = await _queryService.GetFilteredAsync(filter, ct);

            await _cache.SetAsync(key, animes, TimeSpan.FromMinutes(5));

            return animes;
        }

        public Task<AnimeSlugResponse> GetRandomSlugAsync(CancellationToken ct) => _queryService.GetRandomSlugAsync(ct);

        /// <summary> Кешує рандомні аніме. </summary>
        /// <returns> Одне рандомне аніме з кешу або бази </returns>
        /// 
        ///              !Не використовується.!
        public async Task<AnimeResponse> GetRandomAsync(CancellationToken ct)
        {
            // Ідемо в редіс, отримувати список рандомних айді
            List<int>? cachedIds = await _cache.GetAsync<List<int>>("anime:random:ids:");

            // Якщо там щось є -
            if (cachedIds != null)
            {
                if (cachedIds.Count == 0)
                    throw new ArgumentException("Anime is missing");

                // - беремо один рандомний айді з списку, -
                int cachedId = cachedIds[Random.Shared.Next(cachedIds.Count)];

                // Шукаємо це аніме в редісі якщо нема записуємо
                return await GetByIdAsync(cachedId, ct);
            }

            // Якщо список в кешу пустий - Ідемо до бази отримувати нові рандомні айдішки
            List<int> animeIds = await _queryService.GetIdsAsync(ct);

            if (animeIds.Count == 0)
                throw new ArgumentException("Anime is missing");

            // Заносимо до кешу айдішки
            await _cache.SetAsync("anime:random:ids", animeIds, TimeSpan.FromMinutes(60));

            // Беремо рандомний айді
            int animeId = animeIds[Random.Shared.Next(animeIds.Count)];

            // Пробуємо подивитись спочатку анімешку в редіске якщо нема - на базу
            return await GetByIdAsync(animeId, ct);
        }

        /// <summary>
        /// Повертає iframe-епізоди та кешує результат на 1 годину,
        /// щоб зменшити навантаження на балансери.
        /// </summary>
        public async Task<List<PlayerEpisodeSet>> GetEpisodes(int malId, CancellationToken ct)
        {
            var key = $"anime:episodes:{malId}";

            var cached = await _cache.GetAsync<List<PlayerEpisodeSet>>(key);

            if (cached != null)
                return cached;

            var episodes = await _queryService.GetEpisodes(malId, ct);

            await _cache.SetAsync(key, episodes, TimeSpan.FromHours(1));

            return episodes;
        }

        public Task<List<int>> GetIdsAsync(CancellationToken ct) => _queryService.GetIdsAsync(ct);

        public Task<List<string>?> GetScreenshots(int id, CancellationToken ct) => _queryService.GetScreenshots(id, ct);
    }
}
