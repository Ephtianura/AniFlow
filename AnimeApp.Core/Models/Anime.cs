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
            Url = url.ToLower();
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
            Score = score;
            Episodes = episodes;
            EpisodesAired = episodesAired;
            Duration = duration;
        }

        public int Id { get; private set; }

        // Назви
        public List<AnimeTitle> Titles { get; private set; } = new();

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
        public List<string>? ScreenshotsFileName { get; private set; } = new(); // Назви скріншотів в S3
        public string Url { get; private set; } = string.Empty; // Для фронта наприклад  anime/ jujutsu_kaisen

        //public DateTime

        // Навігація
        public int? StudiosId { get; private set; } // Айді студії One-to-Many
        public Studio? Studio { get; private set; } // Інформація про студію

        public List<Genre> Genres { get; private set; } = new(); // Жанри  Many-to-Many

        public List<AnimeRelated> Relateds { get; private set; } = new(); // Пов'язані аніме Many-to-Many
        public ICollection<UserAnime> UserAnimes { get; private set; } = new List<UserAnime>();



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
            if (title == null) throw new ArgumentNullException(nameof(title));

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
            var title = Titles.FirstOrDefault(t => t.Id == titleId);
            if (title == null) throw new InvalidOperationException("Title not found.");

            title.ChangeValue(newValue);

        }
        public void RemoveTitle(int titleId)
        {
            var title = Titles.FirstOrDefault(t => t.Id == titleId);
            if (title == null) throw new InvalidOperationException("Title not found.");

            Titles.Remove(title);
        }

        public void SetStudio(Studio studio)
        {
            Studio = studio ?? throw new ArgumentNullException(nameof(studio));
            StudiosId = studio.Id;
        }

        public void AddGenre(Genre genre)
        {
            if (genre == null) throw new ArgumentNullException(nameof(genre));
            if (!Genres.Contains(genre))
                Genres.Add(genre);
        }
        public void RemoveGenre(Genre genre)
        {
            if (genre == null) throw new ArgumentNullException(nameof(genre));
            Genres.Remove(genre);
        }

        public void AddRelated(Anime relatedAnime, RelationKindEnum type)
        {
            if (relatedAnime == null) throw new ArgumentNullException(nameof(relatedAnime));
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

        public void ClearRelateds() => Relateds.Clear();

        public void UpdateAiredOn(DateTime? airedOn)
        {
            AiredOn = airedOn;
        }
        public void UpdateReleasedOn(DateTime? releasedOn)
        {
            ReleasedOn = releasedOn;
        }
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
        public void UpdateSeason(SeasonEnum newSeason)
        {
            if (!Enum.IsDefined(typeof(SeasonEnum), newSeason))
                throw new ArgumentException("Invalid Season", nameof(newSeason));
            Season = newSeason;
        }
        public void UpdateYear(int year)
        {
            if (year < 1900 || year > DateTime.Now.Year + 10)
                throw new ArgumentOutOfRangeException(nameof(year), "Year seems invalid.");
            Year = year;
        }
        public void UpdateRating(AnimeRatingEnum newRating)
        {
            if (!Enum.IsDefined(typeof(AnimeRatingEnum), newRating))
                throw new ArgumentException("Invalid Rating");
            Rating = newRating;
        }
        public void UpdateKind(AnimeKindEnum newKind)
        {
            if (!Enum.IsDefined(typeof(AnimeKindEnum), newKind))
                throw new ArgumentException("Invalid Kind", nameof(newKind));
            Kind = newKind;
        }
        public void UpdateStatus(AnimeStatusEnum newStatus)
        {
            if (!Enum.IsDefined(typeof(AnimeStatusEnum), newStatus))
                throw new ArgumentException("Invalid Status", nameof(newStatus));
            Status = newStatus;
        }
        public void UpdateDescription(string description)
        {
            Description = description ?? string.Empty;
        }
        public void UpdatePosterFileName(string? posterFileName)
        {
            PosterFileName = posterFileName;
        }
        public void UpdateScreenshotsFileName(List<string>? screenshots)
        {
            ScreenshotsFileName = screenshots ?? new List<string>();
        }
        public void UpdateUrl(string url)
        {
            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("Url cannot be empty.", nameof(url));
            Url = url;
        }

        //public DateTimeOffset? NextEpisodeAt { get; private set; } // Коли вийде наступний епізод
        //public List<Screenshot> Screenshots { get; private set; } = new(); // Many-to-Many
        //public List<int>? CharacterRolesId { get; private set; } //Персонаж та його роль в цьому аніме
        //public List<int>? RelatedsAnimeId { get; private set; } // Айді аніме з яким воно пов'язане 
        //public List<CharacterRole> CharacterRoles { get; private set; } = new();
        //public List<RelatedAnime> Related { get; private set; } = new();
    }
}
