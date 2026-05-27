using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Filters
{
    public class AnimeFilter
    {

        public string? Search { get; set; }  // 🔍 Пошук по назві, ромадзі або URL

        public List<int>? GenresId { get; set; } // 🎭 По жанрах
        public List<string>? GenresSlugs { get; set; }

        public int? StudioId { get; set; }
        public string? StudioSlug { get; set; }

        public AnimeKindEnum? Kind { get; set; } // 🎬 Тип: TV, Movie, OVA...

        public AnimeStatusEnum? Status { get; set; } // 📌 Статус: Anons, Ongoing, Released

        public AnimeRatingEnum? Rating { get; set; } // ⭐ Рейтинг PG-14, R, G…

        public SeasonEnum? Season { get; set; } // 📆 Сезон

        public int? Year { get; set; } // 📅 Рік

        // 📅 Діапазони дат
        public DateTime? AiredFrom { get; set; }
        public DateTime? AiredTo { get; set; }

        public DateTime? ReleasedFrom { get; set; }
        public DateTime? ReleasedTo { get; set; }

        // ⭐ Рейтинг 0–10
        public double? MinScore { get; set; }
        public double? MaxScore { get; set; }

        // 🔢 Епізоди
        public int? MinEpisodes { get; set; }
        public int? MaxEpisodes { get; set; }

        // ⚙️ Сортування "Title.Language-Ukrainian&Type-Official", Score", "Episodes", "AiredOn", "ReleasedOn"
        public AnimeSortBy? SortBy { get; set; }
        public bool SortDesc { get; set; } = true;

        // 📄 Пагінація
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;

        public enum AnimeSortBy
        {
            Title,
            Score,
            Episodes,
            AiredOn,
            ReleasedOn,
            CreatedAt,
            UpdatedAt
        }

        public void Normalize()
        {
            // Pagination
            if (Page <= 0) Page = 1;
            if (PageSize <= 0) PageSize = 20;
            if (PageSize > 100) PageSize = 100;

            // Search
            if (string.IsNullOrWhiteSpace(Search))
                Search = null;
            else
                Search = Search.Trim();

            // Genres
            if (GenresId != null)
            {
                GenresId = GenresId
                    .Where(x => x > 0)
                    .Distinct()
                    .Order()
                    .ToList();

                if (GenresId.Count == 0)
                    GenresId = null;
            }

            if (GenresSlugs != null)
            {
                GenresSlugs = GenresSlugs
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .Select(x => x.Trim().ToLowerInvariant())
                    .Distinct()
                    .Order()
                    .ToList();

                if (GenresSlugs.Count == 0)
                    GenresId = null;
            }

            // Studio
            if (StudioId <= 0)
                StudioId = null;
            if (string.IsNullOrWhiteSpace(StudioSlug))
                StudioSlug = null;

            // Year
            if (Year < 1900 || Year > DateTime.UtcNow.Year + 5)
                Year = null;


            // Score
            if (MinScore < 0) MinScore = null;
            if (MaxScore > 10) MaxScore = 10;

            if (MinScore.HasValue && MaxScore.HasValue && MinScore > MaxScore)
                (MinScore, MaxScore) = (MaxScore, MinScore);

            // Episodes
            if (MinEpisodes < 0) MinEpisodes = null;
            if (MaxEpisodes < 0) MaxEpisodes = null;

            if (MinEpisodes.HasValue && MaxEpisodes.HasValue && MinEpisodes > MaxEpisodes)
                (MinEpisodes, MaxEpisodes) = (MaxEpisodes, MinEpisodes);

            // Date range
            if (AiredFrom.HasValue)
                AiredFrom = ToUtc(AiredFrom.Value);
            if (AiredTo.HasValue)
                AiredTo = ToUtc(AiredTo.Value);

            if (AiredFrom.HasValue && AiredTo.HasValue && AiredFrom > AiredTo)
                (AiredFrom, AiredTo) = (AiredTo, AiredFrom);

            if (ReleasedFrom.HasValue)
                ReleasedFrom = ToUtc(ReleasedFrom.Value);
            if (ReleasedTo.HasValue)
                ReleasedTo = ToUtc(ReleasedTo.Value);

            if (ReleasedFrom.HasValue && ReleasedTo.HasValue && ReleasedFrom > ReleasedTo)
                (ReleasedFrom, ReleasedTo) = (ReleasedTo, ReleasedFrom);

            // SortBy
            if (!SortBy.HasValue)
                SortBy = AnimeSortBy.Score;
            if (!Enum.IsDefined(typeof(AnimeSortBy), SortBy.Value))
                SortBy = AnimeSortBy.Score;
        }

        static DateTime? ToUtc(DateTime? dt)
        {
            if (!dt.HasValue) return null;

            var value = dt.Value;

            return value.Kind switch
            {
                DateTimeKind.Utc => value,
                DateTimeKind.Local => value.ToUniversalTime(),
                DateTimeKind.Unspecified => DateTime.SpecifyKind(value, DateTimeKind.Utc),
                _ => value
            };
        }
    }
}