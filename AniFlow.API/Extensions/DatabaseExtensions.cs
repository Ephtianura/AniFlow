using AniFlow.DataAccess;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace AniFlow.API.Extensions
{
    public static class DatabaseExtensions
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
        {
            var connectionString = config.GetConnectionString(nameof(AniFlowDbContext));

            var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
            dataSourceBuilder.EnableDynamicJson();

            var dataSource = dataSourceBuilder.Build();

            services.AddDbContext<AniFlowDbContext>(options =>
                options.UseNpgsql(dataSource));

            return services;
        }
    }
}