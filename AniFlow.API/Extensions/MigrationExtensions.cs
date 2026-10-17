using AniFlow.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace AniFlow.API.Extensions
{
    public static class MigrationExtensions
    {
        public static async Task ApplyMigrationsAsync(this IServiceProvider services)
        {
            using var scope = services.CreateScope();

            var dbContext = scope.ServiceProvider.GetRequiredService<AniFlowDbContext>();

            await dbContext.Database.MigrateAsync();
        }
    }
}
