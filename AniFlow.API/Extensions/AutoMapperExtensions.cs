using AniFlow.Application.Mapping;

namespace AniFlow.API.Extensions
{
    public static class AutoMapperExtensions
    {
        public static IServiceCollection AddMapping(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<AnimeProfile>();
                cfg.AddProfile<StudioProfile>();
                cfg.AddProfile<UserProfile>();
            });

            return services;
        }
    }
}
