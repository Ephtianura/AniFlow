using AnimeApp.Infrastructure.Auth;

namespace AnimeApp.API.Extensions
{
    public static class AuthExtensions
    {
        public static IServiceCollection AddAuth(this IServiceCollection services, IConfiguration config)
        {
            // Налаштування JWT токену
            services.Configure<JwtOptions>(config.GetSection(nameof(JwtOptions)));
            var jwtOptions = config.GetSection(nameof(JwtOptions)).Get<JwtOptions>()!;
            services.AddApiAuthentication(jwtOptions);

            return services;
        }
    }
}
