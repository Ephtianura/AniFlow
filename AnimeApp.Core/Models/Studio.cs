namespace AnimeApp.Core.Models
{
    // ================= STUDIO =================
    public class Studio
    {
        private Studio() { }
        private Studio(string name, string description = "", string? posterFileName = null)
        {
            ChangeName(name);
            ChangeDescription(description);
            ChangePoster(posterFileName);
        }

        public int Id { get; private set; }
        public string Name { get; private set; }
        public string Description { get; private set; } = string.Empty;
        public string? PosterFileName { get; private set; }

        public List<Anime> Animes { get; private set; } = new();

        // ================= Фабрика =================
        public static Studio Create(string name, string description = "", string? posterFileName = null)
        {
            return new Studio(name, description, posterFileName);
        }

        // ================= Методи =================
        public void ChangeName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Studio name cannot be empty", nameof(name));

            Name = name;
        }

        public void ChangeDescription(string description)
        {
            Description = description ?? string.Empty;
        }

        public void ChangePoster(string? posterFileName)
        {
            PosterFileName = posterFileName;
        }
    }

}