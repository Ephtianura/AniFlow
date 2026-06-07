namespace AnimeApp.Core.Contracts
{
    public interface IDashboardRepository
    {
        Task<AdminDashboardStatsDto> GetAdminDashboardStatsAsync();
    }
}