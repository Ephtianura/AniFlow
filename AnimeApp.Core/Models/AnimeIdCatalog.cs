namespace AnimeApp.Core.Models
{
    public class AnimeIdCatalog
    {
        public int MoonId { get; set; }
        public int? KodikId { get; set; }
        public int? MalId { get; set; }
        public bool IsParsed { get; set; } = false;
        public DateTime LastUpdated { get; private set; } = DateTime.UtcNow;

        public void SetKodikId(int kodikId)
        {
            if (KodikId == kodikId) return;
            KodikId = kodikId;
            Update();
        }

        public void SetMalId(int malId)
        {
            if (MalId == malId) return;
            MalId = malId;
            Update();
        }

        public void MarkAsParsed()
        {
            if (IsParsed) return;
            IsParsed = true;
            Update();
        }
        public void Update() => LastUpdated = DateTime.UtcNow;

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