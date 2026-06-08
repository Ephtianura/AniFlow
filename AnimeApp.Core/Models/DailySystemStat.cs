namespace AnimeApp.Core.Models
{
    public class DailySystemStat
    {
        public int Id { get; set; }
        public DateTime Date { get; set; } 
        public int VisitsCount { get; set; }
        public int UniquesCount { get; set; }
        public int RegistrationsCount { get; set; }
        public int UserInteractionsCount { get; set; }
        public int PlayerViewsCount { get; set; }
        public int PeakOnline { get; set; }
        public int AvgOnline { get; set; }
    }
}
