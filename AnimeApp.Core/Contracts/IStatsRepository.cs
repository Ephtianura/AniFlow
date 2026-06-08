namespace AnimeApp.Core.Contracts
{
    public interface IStatsRepository
    {
        Task<AdminAnimeStatsDto> GetAdminAnimeStatsAsync();
        Task<DashboardPulseDto> GetSystemPulseDataAsync(
            int activeUsersNow, int rps, int visitsToday, int uniquesToday, int viewsToday, int peakOnline, int avgOnline);
        Task SaveDailyAggregatedStatsAsync(DateTime date, int visits, int uniques, int views, int peakOnline, int avgOnline);
        Task SaveEpisodeViewsMetricsAsync(DateTime todayDate, List<EpisodeViewData> episodeViewsList);
        Task<List<AnimeTopDto>> GetTopAnimeByViewsAsync(DateTime startDate, DateTime endDate, int limit = 10);
    }
}