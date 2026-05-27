using AnimeApp.Core.Contracts;
using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Models
{
    // ================= ANIME =================
    public class Anime : IHasUpdatedAt
    {
        public Anime() { }

        private Anime(
            List<AnimeTitle> titles,
            string url,

            AnimeKindEnum? kind,
            AnimeStatusEnum? status,
            AnimeRatingEnum? rating,

            string? description,
            string? posterFileName,

            Studio? studio,
            List<Genre>? genres,
            List<string>? screenshots,

            DateTime? airedOn,
            DateTime? releasedOn,
            SeasonEnum? season,
            int? year,
            double? score,
            int? episodes,
            int? episodesAired,
            int? duration,
            bool nsfw
        )
        {
            Titles = titles;
            UpdateUrl(url);
            Kind = kind;
            Status = status;
            Season = season;
            Year = year;
            Rating = rating;
            Description = description;
            PosterFileName = posterFileName;
            Studio = studio;
            StudiosId = studio?.Id;

            if (genres != null)
                Genres = genres;
            if (screenshots != null)
                ScreenshotsFileName = screenshots;

            AiredOn = airedOn;
            ReleasedOn = releasedOn;
            Score = score ?? 0;
            TotalScores = 0;
            Episodes = episodes;
            EpisodesAired = episodesAired;
            Duration = duration;
            Nsfw = nsfw;
            CreatedAt = DateTime.UtcNow;
        }

        public int Id { get; private set; }
        public string Url { get; private set; } = null!; // Для фронтенду, наприклад: anime/jujutsu_kaisen

        /*!*/
        public int? MoonId { get; set; }
        public string? KodikId { get; set; }
        public int? MalId { get; set; }
        public int? AniListId { get; set; }
        public string? MoonSlug { get; set; }

        // Назви
        public List<AnimeTitle> Titles { get; private set; } = [];

        // Дати
        public DateTime? AiredOn { get; private set; } // Дата найпершої серії
        public DateTime? ReleasedOn { get; private set; } // Дата останньої серії

        // Статистика
        public double Score { get; private set; } // 0 - 10
        public int TotalScores { get; private set; }
        public int? Episodes { get; private set; } // *Загальна кількість епізодів*
        public int? EpisodesAired { get; private set; } // Скільки епізодів *вийшло в ефір*
        public int? Duration { get; private set; } // Середній час однієї серії
        public SeasonEnum? Season { get; private set; } // Winter, Spring, Summer, Fall
        public int? Year { get; private set; } // 2024, 2025...
        public bool Nsfw { get; set; }

        // Rating / Kind / Status / Source
        public AnimeRatingEnum? Rating { get; private set; } // PG-13...
        public AnimeKindEnum? Kind { get; private set; }  // TV, Movie...
        public AnimeStatusEnum? Status { get; private set; } // Anons, Ongoing, Released
        public AnimeSource? Source { get; set; }

        // Опис
        public string? Description { get; private set; }
        public string? PosterFileName { get; private set; } // Назва постеру в S3

        // Очень нужно сделать порядок
        public List<string>? ScreenshotsFileName { get; private set; } = []; // Назви скріншотів в S3

        // Дати
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        // Навігація
        public int? StudiosId { get; private set; } // Айді студії One-to-Many
        public Studio? Studio { get; private set; } // Інформація про студію
        public List<Genre> Genres { get; private set; } = []; // Жанри  Many-to-Many

        public List<AnimeOst> Music { get; set; } = [];
        public List<AnimeVideo> Promos { get; set; } = []; // jsonb???

        public List<ExternalLink>? ExternalLinks { get; set; } = []; // jsonb

        public List<AnimeRelated> Relateds { get; private set; } = []; // Пов'язані аніме Many-to-Many
        public ICollection<UserAnime> UserAnimes { get; private set; } = [];


        // ================= Фабрика =================
        public static Anime Create(CreateAnimeParams p)
        {
            if (p.Titles == null || p.Titles.Count == 0)
                throw new ArgumentException("Anime must have at least one title", nameof(p.Titles));

            if (!p.Titles.Exists(t => t.Language == TitleLanguage.Romaji))
                throw new ArgumentException("Anime must have at least one title in Romaji.", nameof(p.Titles));

            return new Anime(
                p.Titles, p.Url, p.Kind, p.Status, p.Rating, p.Description, p.PosterFileName,
                p.Studio, p.Genres, p.Screenshots, p.AiredOn, p.ReleasedOn, p.Season, p.Year,
                p.Score, p.Episodes, p.EpisodesAired, p.Duration, p.Nsfw
            );
        }

        // ================= Методи =================

        // Назви
        public void AddTitle(AnimeTitle title)
        {
            ArgumentNullException.ThrowIfNull(title);
            Titles.Add(title);
        }
        public void AddTitles(IEnumerable<AnimeTitle> titles)
        {
            if (titles == null) return;
            foreach (var t in titles)
                AddTitle(t);
        }
        public void UpdateTitle(int titleId, string newValue)
        {
            var title = Titles.FirstOrDefault(t => t.Id == titleId) ?? throw new ArgumentException("Title not found.");
            title.ChangeValue(newValue);
        }
        public void RemoveTitle(int titleId)
        {
            var title = Titles.FirstOrDefault(t => t.Id == titleId) ?? throw new ArgumentException("Title not found.");
            Titles.Remove(title);
        }

        // Пов'язані таблиці
        public void SetStudio(Studio studio)
        {
            Studio = studio ?? throw new ArgumentNullException(nameof(studio));
            StudiosId = studio.Id;
        }
        public void AddGenre(Genre genre)
        {
            ArgumentNullException.ThrowIfNull(genre);
            if (!Genres.Contains(genre))
                Genres.Add(genre);
        }
        public void RemoveGenre(Genre genre)
        {
            ArgumentNullException.ThrowIfNull(genre);
            Genres.Remove(genre);
        }
        public void AddRelated(Anime relatedAnime, RelationKindEnum type)
        {
            ArgumentNullException.ThrowIfNull(relatedAnime);
            if (Relateds.Any(r => r.RelatedAnimeId == relatedAnime.Id))
                return;
            Relateds.Add(AnimeRelated.Create(Id, relatedAnime.Id, type));
        }
        public void RemoveRelated(int relatedAnimeId)
        {
            var relation = Relateds.FirstOrDefault(r => r.RelatedAnimeId == relatedAnimeId);
            if (relation != null)
                Relateds.Remove(relation);
        }
        public void ClearRelateds() =>
            Relateds.Clear();

        // Деталі
        public void UpdateAiredOn(DateTime? airedOn) =>
            AiredOn = airedOn;
        public void UpdateReleasedOn(DateTime? releasedOn) =>
            ReleasedOn = releasedOn;
        public void Rate(double score)
        {
            if (score < 0 || score > 10)
                throw new ArgumentOutOfRangeException(nameof(score), "Score must be between 0 and 10.");
            Score = score;
        }
        public void UpdateTotalScores(int scores)
        {
            if (scores < 0)
                throw new ArgumentOutOfRangeException(nameof(scores), "The count of scores cannot be negative");
            TotalScores = scores;
        }
        public void UpdateEpisodes(int episodes)
        {
            if (episodes < 0)
                throw new ArgumentOutOfRangeException(nameof(episodes), "Episodes cannot be negative.");
            Episodes = episodes;
        }
        public void UpdateEpisodesAired(int episodesAired)
        {
            if (episodesAired < 0)
                throw new ArgumentOutOfRangeException(nameof(episodesAired), "Episodes Aired cannot be negative.");
            if (episodesAired > Episodes)
                throw new ArgumentOutOfRangeException(nameof(episodesAired), "Episodes Aired can't be more than episodes.");
            EpisodesAired = episodesAired;
        }
        public void UpdateDuration(int duration)
        {
            if (duration < 0)
                throw new ArgumentOutOfRangeException(nameof(duration), "Duration cannot be negative.");
            Duration = duration;
        }
        public void UpdateSeason(SeasonEnum? newSeason)
        {
            if (newSeason != null && (newSeason < SeasonEnum.Winter || newSeason > SeasonEnum.Fall))
                throw new ArgumentException("Invalid Season", nameof(newSeason));
            Season = newSeason;
        }
        public void UpdateYear(int year)
        {
            if (year < 1900 || year > DateTime.Now.Year + 10)
                throw new ArgumentOutOfRangeException(nameof(year), "Year seems invalid.");
            Year = year;
        }
        public void UpdateRating(AnimeRatingEnum? newRating)
        {
            if (newRating != null && !Enum.IsDefined(typeof(AnimeRatingEnum), newRating))
                throw new ArgumentException("Invalid Rating");
            Rating = newRating;
        }
        public void UpdateKind(AnimeKindEnum? newKind)
        {
            if (newKind != null && !Enum.IsDefined(typeof(AnimeKindEnum), newKind))
                throw new ArgumentException("Invalid Kind", nameof(newKind));
            Kind = newKind;
        }
        public void UpdateStatus(AnimeStatusEnum? newStatus)
        {
            if (newStatus != null && !Enum.IsDefined(typeof(AnimeStatusEnum), newStatus))
                throw new ArgumentException("Invalid Status", nameof(newStatus));
            Status = newStatus;
        }
        public void UpdateDescription(string description) =>
            Description = description ?? string.Empty;
        public void UpdatePosterFileName(string? posterFileName) =>
            PosterFileName = posterFileName;
        public void UpdateScreenshotsFileName(List<string>? screenshots) =>
            ScreenshotsFileName = screenshots ?? [];
        public void UpdateUrl(string url)
        {
            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("Url cannot be empty.", nameof(url));
            Url = url.ToLower().Trim();
        }
        public void Touch() => UpdatedAt = DateTime.UtcNow;

        //public DateTimeOffset? NextEpisodeAt { get; private set; } // Коли вийде наступний епізод
        //public List<int>? CharacterRolesId { get; private set; } //Персонаж та його роль в цьому аніме
        //public List<CharacterRole> CharacterRoles { get; private set; } = new();
    }
}
