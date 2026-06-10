using AnimeApp.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace AnimeApp.API.Extensions
{
    public static class MigrationExtensions
    {
        public static async Task ApplyMigrationsAsync(this IServiceProvider services)
        {
            using var scope = services.CreateScope();

            var dbContext = scope.ServiceProvider.GetRequiredService<AnimeAppDbContext>();

            await dbContext.Database.MigrateAsync();
        }
    }
}
