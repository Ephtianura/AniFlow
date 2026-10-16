using AniFlow.Application.Contracts.App;
using AniFlow.Infrastructure.RedisCache;
using StackExchange.Redis;

namespace AniFlow.API.Extensions
{
    public static class RedisExtensions
    {
        public static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration config)
        {
            services.AddSingleton<IConnectionMultiplexer>(_ =>
                ConnectionMultiplexer.Connect(config.GetConnectionString("Redis")));

            services.AddScoped<IRedisCache, RedisCache>();

            return services;
        }

        public static IServiceCollection AddCacheDecorators(this IServiceCollection services)
        {
            services.Decorate<IAnimeQueryService, AnimeQueryCacheDecorator>();
            services.Decorate<IAnimeCommandService, AnimeCommandCacheDecorator>();

            return services;
        }

    }
}
