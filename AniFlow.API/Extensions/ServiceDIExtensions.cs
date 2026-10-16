using AniFlow.Application.Contracts;
using AniFlow.Application.Contracts.App;
using AniFlow.Application.Contracts.Infra;
using AniFlow.Application.Services;
using AniFlow.Application.Services.AnimeServices;
using AniFlow.Application.Services.Importing;
using AniFlow.Core.Contracts;
using AniFlow.DataAccess.Repositories;
using AniFlow.Infrastructure.Auth;
using AniFlow.Infrastructure.ExternalApi.KodokAPI;
using AniFlow.Infrastructure.ExternalApi.MoonAPI;
using AniFlow.Infrastructure.RedisCache;

namespace AniFlow.API.Extensions
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
            services.AddScoped<IStatsService, StatsService>();
            services.AddScoped<IUserFriendService, UserFriendService>();
            services.AddScoped<ISitemapService, SitemapService>();

            // DI Repositories
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAnimeRepository, AnimeRepository>();
            services.AddScoped<IGenreRepository, GenreRepository>();
            services.AddScoped<IStudioRepository, StudioRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserAnimeRepository, UserAnimeRepository>();
            services.AddScoped<IIdCatalogRepository, IdCatalogRepository>();
            services.AddScoped<IStatsRepository, StatsRepository>();
            services.AddScoped<IUserFriendRepository, UserFriendRepository>();
            services.AddScoped<ISitemapRepository, SitemapRepository>();

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
