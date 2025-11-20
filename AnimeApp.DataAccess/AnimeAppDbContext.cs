
using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;


namespace AnimeApp.DataAccess
{
    public class AnimeAppDbContext : DbContext
    {
        public AnimeAppDbContext(DbContextOptions<AnimeAppDbContext> options)
            : base(options)
        { }

        public DbSet<Anime> Animes => Set<Anime>();
        public DbSet<Genre> Genres => Set<Genre>();
        public DbSet<Studio> Studios => Set<Studio>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AnimeAppDbContext).Assembly);
        }
    }

}