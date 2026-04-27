using AnimeApp.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace AnimeApp.API.Extensions
{
    public static class DatabaseExtensions
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<AnimeAppDbContext>(options =>
                options.UseNpgsql(config.GetConnectionString(nameof(AnimeAppDbContext))));

            return services;
        }
    }
}
