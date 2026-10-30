using AniFlow.Core.Contracts;
using AniFlow.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AniFlow.DataAccess
{
    public class AniFlowDbContext(DbContextOptions<AniFlowDbContext> options) : DbContext(options)
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
        public DbSet<UserFriend> UserFriends => Set<UserFriend>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AniFlowDbContext).Assembly);
        }


        // ==================== Overrides ====================
        public override int SaveChanges()
        {
            ApplyTouch();
            return base.SaveChanges();
        }
        public override Task<int> SaveChangesAsync(CancellationToken ct = default)
        {
            ApplyTouch();
            return base.SaveChangesAsync(ct);
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