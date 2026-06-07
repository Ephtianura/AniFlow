using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace AnimeApp.Core.Models
{
    // ================= STUDIO =================
    public class Studio
    {
        public Studio() { }
        private Studio(string name, string slug, int? malId = null, string description = "", string? posterFileName = null)
        {
            MalId = malId;
            ChangeName(name);
            ChangeSlug(slug);
            ChangeDescription(description);
            ChangePoster(posterFileName);
        }

        public int Id { get; private set; }
        public int? MalId { get; private set; }
        public string Name { get; private set; } = null!;
        public string Slug { get; private set; } = null!;
        public string Description { get; private set; } = string.Empty;
        public string? PosterFileName { get; private set; }

        public List<Anime> Animes { get; private set; } = [];

        // ================= Фабрика =================
        public static Studio Create(string name, string slug, int? malId = null, string description = "", string? posterFileName = null) =>
            new(name, slug, malId, description, posterFileName);

        // ================= Методи =================

        public void ChangeName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name cannot be empty", nameof(name));

            if (!Regex.IsMatch(name, "^[a-zA-Z0-9 -]+$"))
                throw new ArgumentException("Name contains invalid characters", nameof(name));

            Name = name;
        }

        public void ChangeSlug(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug))
                throw new ArgumentException("Studio slug cannot be empty", nameof(slug));

            if (!Regex.IsMatch(slug, "^[a-z0-9-]+$"))
                throw new ArgumentException("Slug contains invalid characters", nameof(slug));

            Slug = slug.Trim().ToLower();
        }

        public void ChangeDescription(string description) =>
            Description = description ?? string.Empty;

        public void ChangePoster(string? posterFileName) =>
            PosterFileName = posterFileName;
        public void ChangeMalId(int? malId) =>
            MalId = malId;

    }
}