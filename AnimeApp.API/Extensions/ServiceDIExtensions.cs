using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Services;
using AnimeApp.Application.Services.AnimeServices;
using AnimeApp.Application.Services.Importing;
using AnimeApp.Core.Contracts;
using AnimeApp.DataAccess.Repositories;
using AnimeApp.Infrastructure.Auth;
using AnimeApp.Infrastructure.ExternalApi.KodokAPI;
using AnimeApp.Infrastructure.ExternalApi.MoonAPI;
using AnimeApp.Infrastructure.RedisCache;

namespace AnimeApp.API.Extensions
{
    public static class ServiceDIExtensions
    {
        public static IServiceCollection AddServicesDI(this IServiceCollection services)
        {
            // DI Services
            services.AddScoped<IAnimeQueryService, AnimeQueryService>();
            services.AddScoped<IAnimeCommandService, AnimeCommandService>();
            services.AddScoped<IAnimeStatsService, AnimeStatsService>();
            services.AddScoped<IAnimeSyncService, AnimeSyncService>();
            services.AddScoped<IAnimeImportService, AnimeImportService>();
            services.AddScoped<IAnimeFactory, AnimeFactory>();
            services.AddScoped<IStudioFactory, StudioFactory>();
            services.AddScoped<IGengesFactory, GengesFactory>();

            services.AddScoped<IGenreService, GenreService>();
            services.AddScoped<IStudioService, StudioService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserAnimeService, UserAnimeService>();

            // DI Repositories
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAnimeRepository, AnimeRepository>();
            services.AddScoped<IGenreRepository, GenreRepository>();
            services.AddScoped<IStudioRepository, StudioRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserAnimeRepository, UserAnimeRepository>();
            services.AddScoped<IIdCatalogRepository, IdCatalogRepository>();
            services.AddScoped<IDashboardRepository, DashboardRepository>();

            // DI Infrastructure
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IJwtProvider, JwtProvider>();
            services.AddScoped<IPasswordHasher, PasswordHasher>();
            services.AddScoped<IRedisCache, RedisCache>();

            services.AddScoped<IMoonApiClient, MoonApiClient>();
            services.AddScoped<IKodikApiClient, KodikApiClient>();

            return services;
        }
    }
}
