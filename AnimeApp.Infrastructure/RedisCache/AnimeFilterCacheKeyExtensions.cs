using AnimeApp.Core.Filters;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace AnimeApp.Infrastructure.RedisCache
{
    namespace AnimeApp.Core.Filters
    {
        public static class AnimeFilterCacheKeyExtensions
        {
            public static string ToCacheKey(this AnimeFilter f)
            {
                var json = JsonSerializer.Serialize(f);

                using var sha = SHA256.Create();

                var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(json));

                return Convert.ToHexString(bytes);
            }
        }
    }

}
