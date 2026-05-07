using AnimeApp.Core.Contracts;

namespace AnimeApp.Core.Models
{
    public class AnimeIdCatalog : IHasUpdatedAt
    {
        public int MoonId { get; set; }
        public int? KodikId { get; set; }
        public int MalId { get; set; }
        public bool IsParsed { get; private set; } = false;
        public DateTime LastUpdated { get; private set; } = DateTime.UtcNow;

        public void MarkAsParsed()
        {
            if (IsParsed) return;
            IsParsed = true;
        }

        public void Touch() => LastUpdated = DateTime.UtcNow;
    }
}




//public AnimeIdCatalog() { }
//public AnimeIdCatalog(
//    int moonId,
//    int? kodikId,
//    int? malId,
//    bool isParsed)
//{
//    MoonId = moonId;
//    KodikId = kodikId;
//    MalId = malId;
//    IsParsed = isParsed;
//    LastUpdated = DateTime.UtcNow;
//}