using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeApp.DataAccess.Configurations
{
    // ===================== USER =====================
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Nickname)
                 .IsRequired()
                 .HasMaxLength(50);

            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.PasswordHash)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(u => u.Role)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(u => u.AvatarFileName)
                .HasMaxLength(200)
                .IsRequired(false);

            builder.Property(u => u.DateOfRegistration)
                .IsRequired();

            // Навігація
            builder.HasMany(u => u.UserAnimes)
                .WithOne(ua => ua.User)
                .HasForeignKey(ua => ua.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }

    // ===================== USER ANIME =====================
    public class UserAnimeConfiguration : IEntityTypeConfiguration<UserAnime>
    {
        public void Configure(EntityTypeBuilder<UserAnime> builder)
        {
            builder.ToTable("UserAnimes");

            builder.HasKey(ua => new { ua.UserId, ua.AnimeId });

            builder.Property(ua => ua.MyList)
                .IsRequired(false)
                .HasConversion<int>();

            builder.Property(ua => ua.Rating)
                .HasColumnType("smallint")
                .IsRequired(false);

            builder.Property(ua => ua.UpdatedAt)
                .IsRequired();

            // Навігація
            builder.HasOne(ua => ua.User)
                .WithMany(u => u.UserAnimes)
                .HasForeignKey(ua => ua.UserId);

            builder.HasOne(ua => ua.Anime)
                .WithMany(a => a.UserAnimes)
                .HasForeignKey(ua => ua.AnimeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Індексація
            builder.HasIndex(ua => ua.Rating);
            builder.HasIndex(ua => ua.MyList);
            builder.HasIndex(ua => ua.IsFavorite);
        }
    }


    // ===================== ANIME =====================
    public class AnimeConfiguration : IEntityTypeConfiguration<Anime>
    {
        public void Configure(EntityTypeBuilder<Anime> builder)
        {
            builder.ToTable("Animes");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Url)
                .IsRequired()
                .HasMaxLength(200);

            builder.HasIndex(x => x.Url).IsUnique();

            builder.Property(a => a.Description)
                .HasMaxLength(2000);

            builder.Property(a => a.PosterFileName)
                .HasMaxLength(200);

            builder.Property(a => a.Score)
                .HasPrecision(3, 1); // 0.0 - 10.0

            builder.Property(x => x.ExternalLinks)
               .HasColumnType("jsonb");

            // Many - to - One: Music
            builder.HasMany(x => x.Music)
            .WithOne()
            .HasForeignKey(x => x.AnimeId)
            .OnDelete(DeleteBehavior.Cascade);

            // Many - to - One: Promos
            builder.HasMany(x => x.Promos)
                .WithOne()
                .HasForeignKey(x => x.AnimeId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Studio
            builder.HasOne(a => a.Studio)
                .WithMany(s => s.Animes)
                .HasForeignKey(a => a.StudiosId)
                .OnDelete(DeleteBehavior.SetNull);

            // Many-to-Many: Genres
            builder.HasMany(a => a.Genres)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "AnimeGenre",
                    j => j.HasOne<Genre>().WithMany().HasForeignKey("GenreId"),
                    j => j.HasOne<Anime>().WithMany().HasForeignKey("AnimeId"),
                    j =>
                    {
                        j.HasKey("AnimeId", "GenreId");
                        j.ToTable("AnimeGenres");
                    });

            // Owned entity: Titles
            builder.OwnsMany(a => a.Titles, t =>
            {
                t.ToTable("AnimeTitles");
                t.WithOwner().HasForeignKey("AnimeId");
                t.HasKey("Id");
                t.Property(tt => tt.Value).IsRequired().HasMaxLength(200);
                t.Property(tt => tt.Language).IsRequired();
                t.Property(tt => tt.Type).IsRequired();
            });

            // Many - to - One: RelatedsAnime
            builder.HasMany(a => a.Relateds)
             .WithOne(r => r.Anime)
             .HasForeignKey(r => r.AnimeId)
             .OnDelete(DeleteBehavior.Cascade);


            builder.HasMany(a => a.UserAnimes)
             .WithOne(ua => ua.Anime)
             .HasForeignKey(ua => ua.AnimeId);
        }
    }

    // ===================== ANIME RELATED =====================
    public class AnimeRelatedConfiguration : IEntityTypeConfiguration<AnimeRelated>
    {
        public void Configure(EntityTypeBuilder<AnimeRelated> builder)
        {
            builder.ToTable("AnimeRelateds");

            builder.HasKey(ar => new { ar.AnimeId, ar.RelatedAnimeId });

            builder.Property(ar => ar.Type)
                   .IsRequired();

            builder.HasOne(ar => ar.Anime)
                   .WithMany(a => a.Relateds)
                   .HasForeignKey(ar => ar.AnimeId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ar => ar.RelatedAnime)
                   .WithMany()
                   .HasForeignKey(ar => ar.RelatedAnimeId)
                   .OnDelete(DeleteBehavior.Restrict); // Не видаляти друге аніме
        }
    }

    // ===================== Anime Id Catalog =====================
    public class AnimeIdCatalogConfiguration : IEntityTypeConfiguration<AnimeIdCatalog>
    {
        public void Configure(EntityTypeBuilder<AnimeIdCatalog> builder)
        {
            builder.ToTable("AnimeIdCatalog");

            builder.HasKey(x => x.MoonId);

            builder.HasIndex(x => x.MalId).IsUnique();
            builder.HasIndex(x => x.KodikId).IsUnique();
        }
    }

    // ===================== AnimeOsts =====================
    public class AnimeOstConfiguration : IEntityTypeConfiguration<AnimeOst>
    {
        public void Configure(EntityTypeBuilder<AnimeOst> builder)
        {
            builder.ToTable("AnimeOsts");

            builder.HasKey(a => a.Id);

            builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(255);

            builder.Property(x => x.Description)
                .HasMaxLength(2000);

            builder.Property(x => x.Author)
                .HasMaxLength(255);

            builder.Property(x => x.SpotifyUrl)
                .HasMaxLength(500);

            builder.Property(x => x.Type)
                .HasConversion<string>();

            // Составной індекс для швидкого пошуку по айді та сортування за порядком
            builder.HasIndex(x => new
            {
                x.AnimeId,
                x.Index
            }).IsUnique();

            builder.HasMany(x => x.Videos)
                .WithOne()
                .HasForeignKey(x => x.AnimeOstId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    // ===================== AnimeVideos =====================
    public class AnimeVideoConfiguration : IEntityTypeConfiguration<AnimeVideo>
    {
        public void Configure(EntityTypeBuilder<AnimeVideo> builder)
        {
            builder.ToTable("AnimeVideos");

            builder.HasKey(a => a.Id);

            builder.Property(x => x.Url)
            .IsRequired()
            .HasMaxLength(1000);

            builder.Property(x => x.Kind)
                .HasConversion<string>();

            builder.HasIndex(x => new
            {
                x.AnimeId,
                x.Index
            }).IsUnique();
        }
    }

    // ===================== GENRES =====================
    public class GenreConfiguration : IEntityTypeConfiguration<Genre>
    {
        public void Configure(EntityTypeBuilder<Genre> builder)
        {
            builder.ToTable("Genres");

            builder.HasKey(g => g.Id);

            builder.Property(g => g.NameEn)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(g => g.NameUa)
                .HasMaxLength(100);

            builder.Property(g => g.NameRu)
                .HasMaxLength(100);
        }
    }

    // ===================== STUDIOS =====================
    public class StudioConfiguration : IEntityTypeConfiguration<Studio>
    {
        public void Configure(EntityTypeBuilder<Studio> builder)
        {
            builder.ToTable("Studios");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(s => s.Description)
                .HasMaxLength(2000);

            builder.Property(s => s.PosterFileName)
                .HasMaxLength(200);

            // One-to-Many: Anime
            builder.HasMany(s => s.Animes)
                .WithOne(a => a.Studio)
                .HasForeignKey(a => a.StudiosId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
