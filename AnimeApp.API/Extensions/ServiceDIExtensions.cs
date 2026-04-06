using AnimeApp.Application.Contracts;
using AnimeApp.Application.Services;
using AnimeApp.Core.Contracts;
using AnimeApp.DataAccess.Repositories;
using AnimeApp.Infrastructure.Auth;
using AnimeApp.Infrastructure.RedisCache;
using GenreApp.DataAccess.Repositories;

namespace AnimeApp.API.Extensions
{
    public static class ServiceDIExtensions
    {
        public static IServiceCollection AddServicesDI(this IServiceCollection services)
        {
            // DI Services
            services.AddScoped<IAnimeService, AnimeService>();
            services.AddScoped<IAnimeStatsService, AnimeStatsService>();
            services.AddScoped<IGenreService, GenreService>();
            services.AddScoped<IStudioService, StudioService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserAnimeService, UserAnimeService>();

            // DI Repositories
            services.AddScoped<IAnimeRepository, AnimeRepository>();
            services.AddScoped<IGenreRepository, GenreRepository>();
            services.AddScoped<IStudioRepository, StudioRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserAnimeRepository, UserAnimeRepository>();

            // DI Infrastructure
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IJwtProvider, JwtProvider>();
            services.AddScoped<IPasswordHasher, PasswordHasher>();
            services.AddScoped<IRedisCache, RedisCache>();

            return services;
        }
    }
}
