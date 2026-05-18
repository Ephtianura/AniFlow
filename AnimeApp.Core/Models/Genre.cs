using AnimeApp.Core.Models;

namespace AnimeApp.Core.Models
{
    // ================= GENRES =================
    public class Genre
    {
        public Genre() { }

        private Genre(string nameEn, string slug, TagType type, string? nameUa = null, string? nameRu = null)
        {
            ChangeNameEn(nameEn);
            ChangeSlug(slug);
            ChangeType(type);
            ChangeNameUa(nameUa);
            ChangeNameRu(nameRu);
        }

        public int Id { get; private set; }
        public string NameEn { get; private set; } = null!;
        public string Slug { get; private set; } = null!;
        public string? NameUa { get; private set; }
        public string? NameRu { get; private set; }
        public TagType Type { get; private set; }

       
        // ================= Фабрика =================
        public static Genre Create(string nameEn, string slug, TagType type, string? nameUa = null, string? nameRu = null) =>
            new(nameEn, slug, type, nameUa, nameRu);

        // ================= Методи =================
        public void ChangeNameEn(string nameEn)
        {
            if (string.IsNullOrWhiteSpace(nameEn))
                throw new ArgumentException("Genre english name cannot be empty", nameof(nameEn));
            NameEn = nameEn;
        }
        public void ChangeSlug(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug))
                throw new ArgumentException("Genre slug cannot be empty", nameof(slug));
            Slug = slug.Trim().ToLower();
        }

        public void ChangeType(TagType type) => Type = type;

        public void ChangeNameUa(string? nameUa) =>
            NameUa = string.IsNullOrWhiteSpace(nameUa) ? null : nameUa;

        public void ChangeNameRu(string? nameRu) =>
            NameRu = string.IsNullOrWhiteSpace(nameRu) ? null : nameRu;
    }

}
