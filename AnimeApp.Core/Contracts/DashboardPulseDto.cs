namespace AnimeApp.Core.Contracts
{
    public class DashboardPulseDto
    {
        public int TotalUsers { get; set; }
        public int TotalAnime { get; set; }
        public int ActiveUsersNow { get; set; }
        public int PeakOnlineToday { get; set; }
        public int AvgOnlineToday { get; set; }
        public int CurrentRps { get; set; }

        public StatBlockDto PlayerViews { get; set; }
        public StatBlockDto Visits { get; set; }
        public StatBlockDto Registrations { get; set; }
        public StatBlockDto UserInteractions { get; set; }

        public List<RecentAnimeItemDto> RecentAnime { get; set; } = [];
    }

    public class StatBlockDto
    {
        public string Label { get; set; }
        public int CountToday { get; set; }
        public int CountWeek { get; set; }
        public List<ChartPointDto> ChartData { get; set; }
    }

    public class ChartPointDto
    {
        public string Date { get; set; } // "08.06"
        public int Value { get; set; }
    }

    public class RecentAnimeItemDto
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public string CreatedAt { get; set; }
    }
}
