namespace AnimeApp.Core.Models
{
    public class AnimeIdCatalog
    {
        public AnimeIdCatalog() { }
        private AnimeIdCatalog(int moonId, int malId, string? kodikId = null, bool? isParsed = null, DateTime? lastUpdated = null)
        {
            MoonId = moonId;
            MalId = malId;
            KodikId = kodikId;
            IsParsed = isParsed ?? false;
            LastUpdated = lastUpdated ?? DateTime.UtcNow;
        }

        public int MoonId { get; private set; }
        public string? KodikId { get; private set; }
        public int MalId { get; private set; }
        public bool IsParsed { get; private set; }
        public DateTime LastUpdated { get; private set; }

        public void MarkAsParsed()
        {
            if (IsParsed) return;
            IsParsed = true;
        }
        public static AnimeIdCatalog Create(int moonId, int malId, string? kodikId = null, bool? isParsed = null, DateTime? lastUpdated = null) => 
            new(moonId, malId, kodikId, isParsed, lastUpdated);
        public void UpdateDate(DateTime lastUpdated) => LastUpdated = lastUpdated;
    }
}