using AnimeApp.DataAccess;
using Microsoft.EntityFrameworkCore;
using Npgsql; 

namespace AnimeApp.API.Extensions
{
    public static class DatabaseExtensions
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
        {
            var connectionString = config.GetConnectionString(nameof(AnimeAppDbContext));

            var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
            dataSourceBuilder.EnableDynamicJson(); 

            var dataSource = dataSourceBuilder.Build();

            services.AddDbContext<AnimeAppDbContext>(options =>
                options.UseNpgsql(dataSource));

            return services;
        }
    }
}