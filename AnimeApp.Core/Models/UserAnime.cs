namespace AnimeApp.Core.Models
{
    public class UserAnime
    {
        // ===================== Конструктор =====================
        public UserAnime() { }
        
        // Ctor
        private UserAnime(User user, Anime anime)
        {
            SetUser(user);
            SetAnime(anime);
            MyList = null;
            Rating = null;
            Touch();
        }

        // ===================== Властивості =====================
        // Id
        public int UserId { get; private set; }
        public int AnimeId { get; private set; }

        // Info
        public MyListEnum? MyList { get; private set; }       // Дивлюсь / Планую / Подивився
        public int? Rating { get; private set; }             // Оцінка аниме від юзера
        public DateTime UpdatedAt { get; private set; }

        // Nav
        public User User { get; private set; }
        public Anime Anime { get; private set; }

        // ===================== Створення =====================
        public static UserAnime Create(User user, Anime anime)
        {
            ArgumentNullException.ThrowIfNull(user);
            ArgumentNullException.ThrowIfNull(anime);
            return new UserAnime(user, anime);
        }
        private void SetUser(User user)
        {
            User = user ?? throw new ArgumentNullException(nameof(user));
            UserId = user.Id;
        }
        private void SetAnime(Anime anime)
        {   
            Anime = anime ?? throw new ArgumentNullException(nameof(anime));
            AnimeId = anime.Id;
        }

        // ===================== Оновлення =====================
        public void MoveToList(MyListEnum? list)
        {
            MyList = list;
            Touch();
        }
        public void Rate(int? rating)
        {
            if (Rating == rating) return;
            if (rating is not null && (rating < 1 || rating > 10))
                throw new ArgumentException("The rating must be between 1 and 10");
            Rating = rating;
            Touch();
        }


        //WatchedEpisodes = 0; // ctor

        //public int WatchedEpisodes { get; private set; }     // Колво епізодів перегляних

        //public void ChangeWatchedEpisodes(int newWatchedEpisodes)
        //{
        //    if (WatchedEpisodes == newWatchedEpisodes) return;
        //    if (newWatchedEpisodes > Anime.Episodes)
        //        throw new ArgumentException("");
        //    WatchedEpisodes = newWatchedEpisodes;
        //}

        private void Touch()
        {
            UpdatedAt = DateTime.UtcNow;
        }
    }
}