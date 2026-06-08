using AnimeApp.Core.Contracts;

namespace AnimeApp.Application.Contracts
{
    public interface IStatsService
    {
        Task<DashboardPulseDto> GetLivePulseAsync();
        Task<List<AnimeTopDto>> GetTopAnimeByViewsAsync(DateTime startDate, DateTime endDate, int limit = 10);
        Task FlushDailyGlobalStatsAsync();
        Task FlushDailyAnimeEpisodeStatsAsync();
    }
}