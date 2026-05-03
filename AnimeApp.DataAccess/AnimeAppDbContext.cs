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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AnimeAppDbContext).Assembly);
        }
    }

}