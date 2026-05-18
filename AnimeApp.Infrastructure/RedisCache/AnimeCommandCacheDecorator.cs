using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Responses.Anime;

namespace AnimeApp.Infrastructure.RedisCache
{
    public class AnimeCommandCacheDecorator(IRedisCache cache, IAnimeCommandService commandService) : IAnimeCommandService
    {
        private readonly IRedisCache _cache = cache;
        private readonly IAnimeCommandService _commandService = commandService;

        public async Task UpdateAsync(int id, AnimeUpdateRequest request)
        {
            var key = $"anime:id:{id}";

            await _commandService.UpdateAsync(id, request);

            await _cache.RemoveAsync(key);
            await _cache.RemoveByPrefixAsync("anime:filter:");
            await _cache.RemoveAsync("anime:random:ids");
        }

        public async Task UpdateFilesAsync(int id, AnimeUpdateFilesRequest request)
        {
            var key = $"anime:id:{id}";

            await _commandService.UpdateFilesAsync(id, request);

            await _cache.RemoveAsync(key);
            await _cache.RemoveByPrefixAsync("anime:filter:");
            await _cache.RemoveAsync("anime:random:ids");
        }

        public async Task<AnimeCreateResponse> CreateAsync(AnimeCreateRequest request)
        {
            var response = await _commandService.CreateAsync(request);

            var key = $"anime:id:{response.Id}";

            await _cache.RemoveAsync(key);
            await _cache.RemoveByPrefixAsync("anime:filter:");
            await _cache.RemoveAsync("anime:random:ids");

            return response;
        }

        public async Task DeleteAsync(int id)
        {
            await _commandService.DeleteAsync(id);

            await _cache.RemoveAsync($"anime:id:{id}");
            await _cache.RemoveByPrefixAsync("anime:filter:");
            await _cache.RemoveAsync("anime:random:ids");
        }

    }
}
