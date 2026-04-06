using AnimeApp.Application.Dto.Responses.Anime;

namespace AnimeApp.Application.Dto.Responses.User
{
    public class UserAnimeListResponse
    {
        public int Watching { get; set; } // Кількість епізодів які дивиться
        public int Completed { get; set; } // Кількість епізодів які завершив
        public int Planned { get; set; } // Кількість епізодів які запланував
        public int Dropped { get; set; } // Кількість епізодів які бросив
        public int Rewatching { get; set; } // Кількість епізодів які переглядає
        public int TotalAnime { get; set; } // Загальна кількість аніме доданих до списку
        public List<AnimeInListResponse> Animes { get; set; } = [];
    }
}