using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Infrastructure.ExternalApi.MoonAPI;

namespace AnimeApp.API.Extensions
{
    public static class MoonExtensions
    {
        public static IServiceCollection AddMoonApi(this IServiceCollection services, IConfiguration config)
        {
            var section = config.GetSection("MoonApi");

            var baseUrl = section["BaseUrl"]
                          ?? throw new InvalidOperationException("MoonApi:BaseUrl not configured");

            services.AddHttpClient<IMoonApiClient, MoonApiClient>(client =>
            {
                client.BaseAddress = new Uri(baseUrl);
                client.Timeout = TimeSpan.FromSeconds(10);
            });

            return services;
        }
    }
}