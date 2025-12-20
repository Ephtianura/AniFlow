using StackExchange.Redis;
using System.Text.Json;

namespace AnimeApp.Infrastructure.RedisCache
{
    public class RedisCache(IConnectionMultiplexer redis) : IRedisCache
    {
        private readonly IDatabase _db = redis.GetDatabase();

        public async Task<T?> GetAsync<T>(string key)
        {
            var value = await _db.StringGetAsync(key);
            if (!value.HasValue)
                return default;

            return JsonSerializer.Deserialize<T>(value!);
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan ttl)
        {
            var json = JsonSerializer.Serialize(value);
            await _db.StringSetAsync(key, json, ttl);
        }

        public Task RemoveAsync(string key)
            => _db.KeyDeleteAsync(key);

        public async Task RemoveByPrefixAsync(string prefix)
        {
            var endpoints = _db.Multiplexer.GetEndPoints();
            foreach (var endpoint in endpoints)
            {
                var server = _db.Multiplexer.GetServer(endpoint);
                var keys = server.Keys(pattern: $"{prefix}*");

                foreach (var key in keys)
                    await _db.KeyDeleteAsync(key);
            }
        }
    }
}
