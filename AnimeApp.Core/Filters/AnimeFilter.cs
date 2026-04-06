using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Filters
{
    public class AnimeFilter
    {
       
        public string? Search { get; set; }  // 🔍 Пошук по назві, ромадзі або URL

        public List<int>? GenresId { get; set; } // 🎭 По жанрах (можна передати декілька)

        public int? StudioId { get; set; }

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
        public string? SortBy { get; set; }
        public bool SortDesc { get; set; }

        // 📄 Пагінація
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
