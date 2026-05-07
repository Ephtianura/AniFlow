using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Services;
using AnimeApp.Core.Filters;
using AnimeApp.Infrastructure.RedisCache.AnimeApp.Core.Filters;

namespace AnimeApp.Infrastructure.RedisCache
{
    public class AnimeCacheDecorator(
        IRedisCache cache,
        AnimeQueryService queryService,
        AnimeCommandService commandService
            ) : IAnimeQueryService, IAnimeCommandService
    {
        private readonly IRedisCache _cache = cache;
        private readonly IAnimeQueryService _queryService = queryService;
        private readonly IAnimeCommandService _commandService = commandService;

        public async Task<AnimeResponse> GetByIdAsync(int id)
        {
            var key = "anime:id:" + id;

            var cached = await _cache.GetAsync<AnimeResponse>(key);

            if (cached != null)
                return cached;

            var anime = await _queryService.GetByIdAsync(id);

            await _cache.SetAsync(key, anime, TimeSpan.FromMinutes(15));

            return anime;
        }

        public async Task<PagedResult<AnimesResponse>> GetFilteredAsync(AnimeFilter filter)
        {
            var key = "anime:filter:" + filter.ToCacheKey();

            var cached = await _cache.GetAsync<PagedResult<AnimesResponse>>(key);
            if (cached != null)
                return cached;

            var animes = await _queryService.GetFilteredAsync(filter);

            await _cache.SetAsync(key, animes, TimeSpan.FromMinutes(5));

            return animes;
        }

        /// <summary> Кешує рандомні аніме. </summary>
        /// <returns> Одне рандомне аніме з кешу або бази </returns>
        public async Task<AnimeResponse> GetRandomAsync()
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
                return await GetByIdAsync(cachedId);
            }

            // Якщо список в кешу пустий - Ідемо до бази отримувати нові рандомні айдішки
            List<int> animeIds = await _queryService.GetIdsAsync();

            if (animeIds.Count == 0)
                throw new ArgumentException("Anime is missing");

            // Заносимо до кешу айдішки
            await _cache.SetAsync("anime:random:ids", animeIds, TimeSpan.FromMinutes(5));

            // Беремо рандомний айді
            int animeId = animeIds[Random.Shared.Next(animeIds.Count)];

            // Пробуємо подивитись спочатку анімешку в редіске якщо нема - на базу
            return await GetByIdAsync(animeId);
        }


        public async Task UpdateAsync(int id, AnimeUpdateRequest request)
        {
            var key = "anime:id:" + id;

            await _commandService.UpdateAsync(id, request);

            await _cache.RemoveAsync(key);
            await _cache.RemoveByPrefixAsync("anime:filter:");
            await _cache.RemoveAsync("anime:random:ids");
        }

        public async Task UpdateFilesAsync(int id, AnimeUpdateFilesRequest request)
        {
            var key = "anime:id:" + id;

            await _commandService.UpdateFilesAsync(id, request);

            await _cache.RemoveAsync(key);
            await _cache.RemoveByPrefixAsync("anime:filter:");
            await _cache.RemoveAsync("anime:random:ids");
        }

        public async Task<AnimeCreateResponse> CreateAsync(AnimeCreateRequest request)
        {
            var response = await _commandService.CreateAsync(request);

            var key = "anime:id:" + response.Id;

            await _cache.RemoveAsync(key);
            await _cache.RemoveByPrefixAsync("anime:filter:");
            await _cache.RemoveAsync("anime:random:ids");

            return response;
        }

        public async Task DeleteAsync(int id)
        {
            await _commandService.DeleteAsync(id);

            await _cache.RemoveAsync("anime:id:" + id);
            await _cache.RemoveByPrefixAsync("anime:filter:");
            await _cache.RemoveAsync("anime:random:ids");
        }

        public Task<List<int>> GetIdsAsync() => _queryService.GetIdsAsync();
    }
}
