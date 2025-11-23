using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

            builder.Property(u => u.Theme)
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

    public class UserAnimeConfiguration : IEntityTypeConfiguration<UserAnime>
    {
        public void Configure(EntityTypeBuilder<UserAnime> builder)
        {
            builder.ToTable("UserAnimes");

            builder.HasKey(ua => new { ua.UserId, ua.AnimeId });

            builder.Property(ua => ua.MyList)
                .IsRequired()
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

            builder.Property(a => a.Description)
                .HasMaxLength(2000);

            builder.Property(a => a.PosterFileName)
                .HasMaxLength(200);

            builder.Property(a => a.Score)
                .HasPrecision(3, 1); // 0.0 - 10.0

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

            //Many - to - Many: Animes
            builder.HasMany(a => a.Relateds)
             .WithOne(r => r.Anime) 
             .HasForeignKey(r => r.AnimeId)
             .OnDelete(DeleteBehavior.Cascade); 


            builder.HasMany(a => a.UserAnimes)
             .WithOne(ua => ua.Anime)
             .HasForeignKey(ua => ua.AnimeId);
        }
    }

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
