using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AnimeApp.DataAccess
{
    public class AnimeAppDbContext(DbContextOptions<AnimeAppDbContext> options) : DbContext(options)
    {
        public DbSet<Anime> Animes => Set<Anime>();
        public DbSet<Genre> Genres => Set<Genre>();
        public DbSet<Studio> Studios => Set<Studio>();
        public DbSet<User> Users => Set<User>();
        public DbSet<UserAnime> UserAnimes => Set<UserAnime>();
        public DbSet<AnimeIdCatalog> AnimeIdCatalog => Set<AnimeIdCatalog>();
        public DbSet<AnimeOst> AnimeOsts => Set<AnimeOst>();
        public DbSet<AnimeVideo> AnimeVideos => Set<AnimeVideo>();
        public DbSet<DailySystemStat> DailySystemStat => Set<DailySystemStat>();
        public DbSet<AnimeDailyStats> AnimeDailyStats => Set<AnimeDailyStats>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AnimeAppDbContext).Assembly);
        }


        // ==================== Overrides ====================
        public override int SaveChanges()
        {
            ApplyTouch();
            return base.SaveChanges();
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyTouch();
            return base.SaveChangesAsync(cancellationToken);
        }
        private void ApplyTouch()
        {
            var entries = ChangeTracker
                .Entries<IHasUpdatedAt>()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                entry.Entity.Touch();
            }
        }
    }
}