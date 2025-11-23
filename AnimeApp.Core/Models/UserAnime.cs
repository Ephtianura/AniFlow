using AnimeApp.Core.Enums;
using System.Data;

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
            MyList = MyListEnum.None;
            Rating = null;
            Touch();
        }

        // ===================== Властивості =====================
        // Id
        public int UserId { get; private set; }
        public int AnimeId { get; private set; }

        // Info
        public MyListEnum MyList { get; private set; }       // Дивлюсь / Планую / Подивився
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
        public void ChangeMyList(MyListEnum newMyList)
        {
            if (!Enum.IsDefined(typeof(MyListEnum), newMyList))
                throw new ArgumentException("Invalid type in MyList");
            MyList = newMyList;
            Touch();
        }
        public void ChangeRating(int? newRating)
        {
            if (Rating == newRating) return;
            if (newRating < 1 || newRating > 10)
                throw new ArgumentException("The rating must be between 1 and 10");
            Rating = newRating;
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