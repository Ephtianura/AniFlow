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
        public static Studio Create( string name, string slug, int? malId = null, string description = "", string? posterFileName = null) =>
            new(name, slug, malId, description, posterFileName);

        // ================= Методи =================
        public void ChangeName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Studio name cannot be empty", nameof(name));
            Name = name;
        }

        public void ChangeSlug(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug))
                throw new ArgumentException("Studio slug cannot be empty", nameof(slug));
            Slug = slug.Trim().ToLower();
        }

        public void ChangeDescription(string description) =>
            Description = description ?? string.Empty;

        public void ChangePoster(string? posterFileName) =>
            PosterFileName = posterFileName;
    }
}