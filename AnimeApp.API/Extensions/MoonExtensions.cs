using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Infrastructure.ExternalApi.MoonAPI;
using AnimeApp.Infrastructure.RedisCache;

namespace AnimeApp.API.Extensions
{
    public static class MoonExtensions
    {
        public static IServiceCollection AddMoonApi(this IServiceCollection services, IConfiguration config)
        {
            var section = config.GetSection("MoonApi");

            var baseUrl = section["BaseUrl"]
                          ?? throw new InvalidOperationException("MoonApi:BaseUrl not configured");

            services.AddHttpClient<MoonApiClient>(client =>
            {
                client.BaseAddress = new Uri(baseUrl);
                client.Timeout = TimeSpan.FromSeconds(10);
            });

            services.AddScoped<IMoonApiClient>(provider =>
            {
                var originalClient = provider.GetRequiredService<MoonApiClient>();
                var cache = provider.GetRequiredService<IRedisCache>();

                return new MoonApiCacheDecorator(cache, originalClient);
            });
            return services;
        }
    }
}