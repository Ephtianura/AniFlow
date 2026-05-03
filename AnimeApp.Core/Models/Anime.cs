using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Models
{
    // ================= ANIME =================
    public class Anime
    {
        public Anime() { }

        private Anime(
            List<AnimeTitle> titles,
            string url,

            AnimeKindEnum kind,
            AnimeStatusEnum status,
            AnimeRatingEnum rating,

            string description,
            string? posterFileName,

            Studio? studio,
            List<Genre>? genres,

            List<string>? screenshots,

            DateTime? airedOn,
            DateTime? releasedOn,
            SeasonEnum season,
            int year,
            double score,
            int episodes,
            int episodesAired,
            int duration
        )
        {
            Titles = titles;
            Url = url.ToLower().Trim();
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

            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;

            AiredOn = airedOn;
            ReleasedOn = releasedOn;
            Score = score;
            Episodes = episodes;
            EpisodesAired = episodesAired;
            Duration = duration;
        }

        public int Id { get; private set; }
        public int MalId { get; private set; }
        public int AniListId { get; private set; }

        // Назви
        public List<AnimeTitle> Titles { get; private set; } = [];

        // Дати
        public DateTime? AiredOn { get; private set; } // Дата найпершої серії
        public DateTime? ReleasedOn { get; private set; } // Дата останньої серії

        // Статистика
        public double Score { get; private set; } // 0 - 10
        public int TotalScores { get; private set; }
        public int Episodes { get; private set; } // *Загальна кількість епізодів*
        public int EpisodesAired { get; private set; } // Скільки епізодів *вийшло в ефір*
        public int Duration { get; private set; } // Середній час однієї серії
        public SeasonEnum Season { get; private set; } // Winter, Spring, Summer, Fall
        public int Year { get; private set; } // 2024, 2025...

        // Rating / Kind / Status
        public AnimeRatingEnum Rating { get; private set; } // PG-13...
        public AnimeKindEnum Kind { get; private set; }  // TV, Movie...
        public AnimeStatusEnum Status { get; private set; } // Anons, Ongoing, Released

        // Опис
        public string Description { get; private set; } = string.Empty;
        public string? PosterFileName { get; private set; } // Назва постеру в S3
        public List<string>? ScreenshotsFileName { get; private set; } = []; // Назви скріншотів в S3
        public string Url { get; private set; } = string.Empty; // Для фронтенду, наприклад: anime/jujutsu_kaisen

        // Дати
        public DateTime CreatedAt { get; }
        public DateTime UpdatedAt { get; private set; }

        // Навігація
        public int? StudiosId { get; private set; } // Айді студії One-to-Many
        public Studio? Studio { get; private set; } // Інформація про студію
        public List<Genre> Genres { get; private set; } = []; // Жанри  Many-to-Many

        public List<AnimeRelated> Relateds { get; private set; } = []; // Пов'язані аніме Many-to-Many
        public ICollection<UserAnime> UserAnimes { get; private set; } = [];


        // ================= Фабрика =================
        public static Anime Create(
            List<AnimeTitle> titles,
            string url,

            AnimeKindEnum kind = AnimeKindEnum.Unknown,
            AnimeStatusEnum status = AnimeStatusEnum.Unknown,
            AnimeRatingEnum rating = AnimeRatingEnum.Unknown,

            string description = "",
            string? posterFileName = null,

            Studio? studio = null,
            List<Genre>? genres = null,

            List<string>? screenshots = null,

            DateTime? airedOn = null,
            DateTime? releasedOn = null,
            SeasonEnum season = SeasonEnum.Unknown,
            int year = 0,

            double score = 0,
            int episodes = 0,
            int episodesAired = 0,
            int duration = 0
        )
        {
            if (titles == null || !titles.Any())
                throw new ArgumentException("Anime must have at least one title", nameof(titles));

            if (!titles.Any(t => t.Language == TitleLanguage.Romaji))
                throw new ArgumentException("Anime must have at least one title in Romaji.", nameof(titles));

            return new Anime(
               titles, url, kind, status, rating, description, posterFileName,
               studio, genres, screenshots, airedOn, releasedOn, season, year,
               score, episodes, episodesAired, duration
            );
        }

        // ================= Методи =================

        // Назви
        public void AddTitle(AnimeTitle title)
        {
            ArgumentNullException.ThrowIfNull(title);
            Titles.Add(title);
            Touch();
        }
        public void AddTitles(IEnumerable<AnimeTitle> titles)
        {
            if (titles == null) return;
            foreach (var t in titles)
                AddTitle(t);
            Touch();
        }
        public void UpdateTitle(int titleId, string newValue)
        {
            var title = Titles.FirstOrDefault(t => t.Id == titleId) ?? throw new ArgumentException("Title not found.");
            title.ChangeValue(newValue);
            Touch();
        }
        public void RemoveTitle(int titleId)
        {
            var title = Titles.FirstOrDefault(t => t.Id == titleId) ?? throw new ArgumentException("Title not found.");
            Titles.Remove(title);
            Touch();
        }

        // Пов'язані таблиці
        public void SetStudio(Studio studio)
        {
            Studio = studio ?? throw new ArgumentNullException(nameof(studio));
            StudiosId = studio.Id;
            Touch();
        }
        public void AddGenre(Genre genre)
        {
            ArgumentNullException.ThrowIfNull(genre);
            if (!Genres.Contains(genre))
                Genres.Add(genre);
            Touch();
        }
        public void RemoveGenre(Genre genre)
        {
            ArgumentNullException.ThrowIfNull(genre);
            Genres.Remove(genre);
            Touch();
        }
        public void AddRelated(Anime relatedAnime, RelationKindEnum type)
        {
            ArgumentNullException.ThrowIfNull(relatedAnime);
            if (Relateds.Any(r => r.RelatedAnimeId == relatedAnime.Id))
                return;
            Relateds.Add(AnimeRelated.Create(Id, relatedAnime.Id, type));
            Touch();
        }
        public void RemoveRelated(int relatedAnimeId)
        {
            var relation = Relateds.FirstOrDefault(r => r.RelatedAnimeId == relatedAnimeId);
            if (relation != null)
                Relateds.Remove(relation);
            Touch();
        }
        public void ClearRelateds()
        {
            Relateds.Clear();
            Touch();
        }

        // Деталі
        public void UpdateAiredOn(DateTime? airedOn)
        {
            AiredOn = airedOn;
            Touch();
        }
        public void UpdateReleasedOn(DateTime? releasedOn)
        {
            ReleasedOn = releasedOn;
            Touch();
        }
        public void Rate(double score)
        {
            if (score < 0 || score > 10)
                throw new ArgumentOutOfRangeException(nameof(score), "Score must be between 0 and 10.");
            Score = score;
            Touch();
        }
        public void UpdateTotalScores(int scores)
        {
            if (scores < 0)
                throw new ArgumentOutOfRangeException(nameof(scores), "The count of scores cannot be negative");
            TotalScores = scores;
            Touch();
        }
        public void UpdateEpisodes(int episodes)
        {
            if (episodes < 0)
                throw new ArgumentOutOfRangeException(nameof(episodes), "Episodes cannot be negative.");
            Episodes = episodes;
            Touch();
        }
        public void UpdateEpisodesAired(int episodesAired)
        {
            if (episodesAired < 0)
                throw new ArgumentOutOfRangeException(nameof(episodesAired), "Episodes Aired cannot be negative.");
            if (episodesAired > Episodes)
                throw new ArgumentOutOfRangeException(nameof(episodesAired), "Episodes Aired can't be more than episodes.");
            EpisodesAired = episodesAired;
            Touch();
        }
        public void UpdateDuration(int duration)
        {
            if (duration < 0)
                throw new ArgumentOutOfRangeException(nameof(duration), "Duration cannot be negative.");
            Duration = duration;
            Touch();
        }
        public void UpdateSeason(SeasonEnum newSeason)
        {
            if (!Enum.IsDefined(typeof(SeasonEnum), newSeason))
                throw new ArgumentException("Invalid Season", nameof(newSeason));
            Season = newSeason;
            Touch();
        }
        public void UpdateYear(int year)
        {
            if (year < 1900 || year > DateTime.Now.Year + 10)
                throw new ArgumentOutOfRangeException(nameof(year), "Year seems invalid.");
            Year = year;
            Touch();
        }
        public void UpdateRating(AnimeRatingEnum newRating)
        {
            if (!Enum.IsDefined(typeof(AnimeRatingEnum), newRating))
                throw new ArgumentException("Invalid Rating");
            Rating = newRating;
            Touch();
        }
        public void UpdateKind(AnimeKindEnum newKind)
        {
            if (!Enum.IsDefined(typeof(AnimeKindEnum), newKind))
                throw new ArgumentException("Invalid Kind", nameof(newKind));
            Kind = newKind;
            Touch();
        }
        public void UpdateStatus(AnimeStatusEnum newStatus)
        {
            if (!Enum.IsDefined(typeof(AnimeStatusEnum), newStatus))
                throw new ArgumentException("Invalid Status", nameof(newStatus));
            Status = newStatus;
            Touch();
        }
        public void UpdateDescription(string description)
        {
            Description = description ?? string.Empty;
            Touch();
        }
        public void UpdatePosterFileName(string? posterFileName)
        {
            PosterFileName = posterFileName;
            Touch();
        }
        public void UpdateScreenshotsFileName(List<string>? screenshots)
        {
            ScreenshotsFileName = screenshots ?? new List<string>();
            Touch();
        }
        public void UpdateUrl(string url)
        {
            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("Url cannot be empty.", nameof(url));
            Url = url.ToLower().Trim();
            Touch();
        }
        public void Touch() => UpdatedAt = DateTime.UtcNow;

        //public DateTimeOffset? NextEpisodeAt { get; private set; } // Коли вийде наступний епізод
        //public List<int>? CharacterRolesId { get; private set; } //Персонаж та його роль в цьому аніме
        //public List<CharacterRole> CharacterRoles { get; private set; } = new();
    }
}
