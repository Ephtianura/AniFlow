using AnimeApplication.Core.Enums;

namespace AnimeApp.Core.Models
{
    public class AnimeRelated
    {
        private AnimeRelated() { } 

        private AnimeRelated(int animeId, int relatedAnimeId, RelationKindEnum type)
        {
            AnimeId = animeId;
            RelatedAnimeId = relatedAnimeId;
            Type = type;
        }

        // Основне аніме
        public int AnimeId { get; private set; }
        public Anime Anime { get; private set; } = null!;

        // Пов'язане аниме
        public int RelatedAnimeId { get; private set; }
        public Anime RelatedAnime { get; private set; } = null!;

        public RelationKindEnum Type { get; private set; }

        // =================== Фабрика ===================
        public static AnimeRelated Create(int animeId, int relatedAnimeId, RelationKindEnum type)
        {
            return new AnimeRelated(animeId, relatedAnimeId, type);
        }

        // =================== Методи ===================
        public void UpdateType(RelationKindEnum newType)
        {
            Type = newType;
        }
    }

}