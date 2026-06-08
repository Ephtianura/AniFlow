namespace AnimeApp.Core.Models
{
    public class AnimeDailyStats
    {
        public DateTime Date { get; set; }
        public int AnimeId { get; set; }
        public int EpisodeNumber { get; set; }
        public int ViewsCount { get; set; }
    }
}
