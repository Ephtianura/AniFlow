using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Responses.Anime;
using Quartz.Util;

namespace AnimeApp.Infrastructure.RedisCache
{
    public class AnimeCommandCacheDecorator(IRedisCache cache, IAnimeCommandService commandService) : IAnimeCommandService
    {
        private readonly IRedisCache _cache = cache;
        private readonly IAnimeCommandService _commandService = commandService;

        public async Task UpdateBaseAsync(int id, AnimeUpdateRequest request)
        {
            await _commandService.UpdateBaseAsync(id, request);

            var key = $"anime:id:{id}";
            await _cache.RemoveAsync(key);
            await _cache.RemoveByPrefixAsync("anime:filter:");
        }

        public async Task UpdateFilesAsync(int id, AnimeUpdateFilesRequest request)
        {
            await _commandService.UpdateFilesAsync(id, request);

            var key = $"anime:id:{id}";
            await _cache.RemoveAsync(key);
            await _cache.RemoveByPrefixAsync("anime:filter:");
        }

        public async Task<AnimeCreateResponse> CreateAsync(AnimeCreateRequest request)
        {
            var response = await _commandService.CreateAsync(request);

            var key = $"anime:id:{response.Id}";

            await _cache.RemoveAsync(key);
            await _cache.RemoveByPrefixAsync("anime:filter:");

            return response;
        }

        public async Task DeleteAsync(int id)
        {
            await _commandService.DeleteAsync(id);

            await _cache.RemoveAsync($"anime:id:{id}");
            await _cache.RemoveByPrefixAsync("anime:filter:");
        }

        public async Task OrderScreenshots(int id, AnimeOrderScreenshotsRequest request)
        {
            var key = $"anime:id:{id}";
            await _commandService.OrderScreenshots(id, request);
            await _cache.RemoveAsync(key);
        }

        public async Task<RelatedUpdateResult> UpdateRelated(int id, RelatedsAnimeRequest request)
        {
            var result = await _commandService.UpdateRelated(id, request);

            var idsToInvalidate = new HashSet<int> { id };
            idsToInvalidate.UnionWith(result.Current.Select(c => c.RelatedAnimeId));
            idsToInvalidate.UnionWith(result.Updated.Select(u => u.RelatedAnimeId));
            idsToInvalidate.UnionWith(result.Deleted.Select(d => d.RelatedAnimeId));

            var cacheKeys = idsToInvalidate.Select(animeId => $"anime:id:{animeId}");

            await _cache.RemoveMultipleAsync(cacheKeys);
            return result;
        }
    }
}
