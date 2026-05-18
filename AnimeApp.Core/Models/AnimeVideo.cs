using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Models
{
    public class AnimeVideo
    {
        public int Id { get; private set; }
        public int AnimeId { get; set; }
        public Anime Anime { get; set; } = null!;
        public int? AnimeOstId { get; set; } // Опціонально (зазвичай) має приналежність до осту
        public string Url { get; set; } = null!;
        public VideoKind Kind { get; set; }
        public int Index { get; set; } // Порядок всередені AnimeOst або Promos
    }
}
