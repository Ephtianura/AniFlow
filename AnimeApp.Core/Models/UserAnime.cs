using AnimeApp.Core.Contracts;
using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Models
{
    public class UserAnime : IHasUpdatedAt
    {
        public UserAnime() { }

        private UserAnime(User user, Anime anime)
        {
            InitUser(user);
            InitAnime(anime);
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

        // Nav
        public User User { get; private set; } = null!;
        public Anime Anime { get; private set; } = null!;

        public bool IsEmpty() =>
                Rating == null
                && MyList == null
                && !IsFavorite;

        // ===================== Створення =====================
        public static UserAnime Create(User user, Anime anime)
        {
            ArgumentNullException.ThrowIfNull(user);
            ArgumentNullException.ThrowIfNull(anime);
            return new UserAnime(user, anime);
        }

        private void InitUser(User user)
        {
            User = user ?? throw new ArgumentNullException(nameof(user));
            UserId = user.Id;
        }
        private void InitAnime(Anime anime)
        {
            Anime = anime ?? throw new ArgumentNullException(nameof(anime));
            AnimeId = anime.Id;
        }

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