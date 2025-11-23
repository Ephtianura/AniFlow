namespace AnimeApp.Application.Dto.User
{
    public class UserProfileResponse
    {
        public int Id { get; set; }
        public string Nickname { get; set; } = null!;
        public string? AvatarFileName { get; set; }
        public string Email { get; set; } = null!;

        // Статистика
        public int Watching { get; set; } // Кількість епізодів які дивиться
        public int Completed { get; set; } // Кількість епізодів які завершив
        public int Planned { get; set; } // Кількість епізодів які запланував
        public int Dropped { get; set; } // Кількість епізодів які бросив
        public int Rewatching { get; set; } // Кількість епізодів які переглядає
        public int TotalAnime { get; set; } // Загальна кількість аніме доданих до списку
        public int TotalEpisodes { get; set; } // Загальна кількість перегляних епізодів
        public double AverageScore { get; set; } // Середній бал який ставить користувач
        public TimeSpan TimeSpent { get; set; } // Загальна кількість затраченого часу на перегляд аніме СУММПРОИЗВ(anime.Episodes*anime.Duration)
    }
}