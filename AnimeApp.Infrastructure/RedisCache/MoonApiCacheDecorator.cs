using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.External;

namespace AnimeApp.Infrastructure.RedisCache
{
    public class MoonApiCacheDecorator(IRedisCache cache, IMoonApiClient moonApi) : IMoonApiClient
    {
        private readonly IRedisCache _cache = cache;
        private readonly IMoonApiClient _moonApi = moonApi;

        public async Task<List<AnimeIdDto>> GetAllAnimeIdsAsync()
        {
            var key = "moon:ids";

            var cached = await _cache.GetAsync<List<AnimeIdDto>>(key);

            if (cached != null)
                return cached;

            var ids = await _moonApi.GetAllAnimeIdsAsync();

            await _cache.SetAsync(key, ids, TimeSpan.FromDays(1));

            return ids;
        }

        public async Task<TagsDto> GetAllTags()
        {
            var key = "moon:tags";

            var cached = await _cache.GetAsync<TagsDto>(key);

            if (cached != null)
                return cached;

            var tags = await _moonApi.GetAllTags();

            await _cache.SetAsync(key, tags, TimeSpan.FromDays(7));

            return tags;
        }

        public async Task<List<VoiceEpisodeSet>> GetEpisodes(int malId)
        {
            var key = $"moon:episodes:{malId}";

            var cached = await _cache.GetAsync<List<VoiceEpisodeSet>>(key);

            if (cached != null)
                return cached;

            var episodes = await _moonApi.GetEpisodes(malId);

            await _cache.SetAsync(key, episodes, TimeSpan.FromHours(1));

            return episodes;
        }

        public async Task<AnimeFullRaw> GetFullAnimeInfo(int moonId)
        {
            var key = $"moon:full:{moonId}";

            var cached = await _cache.GetAsync<AnimeFullRaw>(key);

            if (cached != null)
                return cached;

            var full = await _moonApi.GetFullAnimeInfo(moonId);

            await _cache.SetAsync(key, full, TimeSpan.FromDays(1));

            return full;
        }

        public async Task<List<EpisodeRecent>> LastAnimeUpdated()
        {
            var key = "moon:recent";

            var cached = await _cache.GetAsync<List<EpisodeRecent>>(key);

            if (cached != null)
                return cached;

            var recent = await _moonApi.LastAnimeUpdated();

            await _cache.SetAsync(key, recent, TimeSpan.FromMinutes(1));

            return recent;
        }
    }
}
