using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Models
{
    public class AnimeOst
    {
        public int Id { get; private set; }
        public int AnimeId { get; set; }
        public Anime Anime { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? Author { get; set; }
        public OstType Type { get; set; } // Opening / Ending ...
        public string? SpotifyUrl { get; set; }
        public int Index { get; set; } // Порядок відображення пісень

        // Відео конкретно цієї пісні
        public List<AnimeVideo> Videos { get; set; } = [];
    }
}
