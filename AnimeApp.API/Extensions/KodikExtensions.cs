using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Infrastructure.ExternalApi.KodokAPI;

namespace AnimeApp.API.Extensions
{
    public static class KodikExtensions
    {
        public static IServiceCollection AddKodikApi(this IServiceCollection services, IConfiguration config)
        {
            var section = config.GetSection("KodikApi");

            var baseUrl = section["BaseUrl"]
                          ?? throw new InvalidOperationException("KodikApi:BaseUrl not configured");

            services.AddHttpClient<IKodikApiClient, KodikApiClient>(client =>
            {
                client.BaseAddress = new Uri(baseUrl);
                client.Timeout = TimeSpan.FromSeconds(5);
            });

            return services;
        }
    }
}