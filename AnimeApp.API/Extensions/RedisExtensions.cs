using AnimeApp.Application.Contracts;
using AnimeApp.Application.Services;
using AnimeApp.Infrastructure.RedisCache;
using StackExchange.Redis;

namespace AnimeApp.API.Extensions
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
            services.AddScoped<AnimeQueryService>();
            services.AddScoped<AnimeCommandService>();

            services.AddScoped<AnimeCacheDecorator>();

            services.AddScoped<IAnimeQueryService>(sp =>
                sp.GetRequiredService<AnimeCacheDecorator>());

            services.AddScoped<IAnimeCommandService>(sp =>
                sp.GetRequiredService<AnimeCacheDecorator>());

            return services;
        }

    }
}
