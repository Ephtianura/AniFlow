
namespace AnimeApp.Infrastructure.RedisCache
{
    public interface IRedisCache
    {
        Task<T?> GetAsync<T>(string key);
        Task RemoveAsync(string key);
        Task RemoveByPrefixAsync(string prefix);
        Task SetAsync<T>(string key, T value, TimeSpan ttl);
    }
}