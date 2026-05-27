using AnimeApp.Core.Contracts;
using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Models
{
    public class UserAnime : IHasUpdatedAt
    {
        public UserAnime() { }

        private UserAnime(int userId, int animeId)
        {
            InitUser(userId);
            InitAnime(animeId);
            MyList = null;
            Rating = null;
            IsFavorite = false;
        }

        // Id
        public int UserId { get; private set; }
        public int AnimeId { get; private set; }

        // Info
        public MyListEnum? MyList { get; private set; }       // Дивлюсь / Планую / Подивився і т.д.
        public int? Rating { get; private set; }             // Оцінка аниме від юзера
        public bool IsFavorite { get; private set; }        // Чи улюблене аніме 
        public DateTime UpdatedAt { get; private set; }

        public bool IsEmpty() =>
                Rating == null
                && MyList == null
                && !IsFavorite;

        // ===================== Створення =====================
        public static UserAnime Create(int userId, int animeId) => new(userId, animeId);

        private void InitUser(int userId) =>
            UserId = userId;
        private void InitAnime(int animeId) =>
            AnimeId = animeId;

        // ===================== Оновлення =====================
        public void MoveToList(MyListEnum? list) => MyList = list;

        public void Rate(int? rating)
        {
            if (Rating == rating) return;
            if (rating is not null && (rating < 1 || rating > 10))
                throw new ArgumentException("The rating must be between 1 and 10");
            Rating = rating;
        }

        public void MarkAsFavorites()
        {
            if (IsFavorite) return;
            IsFavorite = true;
        }

        public void RemoveFromFavorites()
        {
            if (!IsFavorite) return;
            IsFavorite = false;
        }

        public void Touch() => UpdatedAt = DateTime.UtcNow;

        //WatchedEpisodes = 0; // ctor
        //public int WatchedEpisodes { get; private set; }     // Колво епізодів перегляних
        //public void ChangeWatchedEpisodes(int newWatchedEpisodes)
        //{
        //    if (WatchedEpisodes == newWatchedEpisodes) return;
        //    if (newWatchedEpisodes > Anime.Episodes)
        //        throw new ArgumentException("");
        //    WatchedEpisodes = newWatchedEpisodes;
        //}
    }
}