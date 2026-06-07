using AnimeApp.Core.Contracts;

namespace AnimeApp.Application.Contracts.App
{
    public interface IAnimeStatsService
    {
        Task RecalculateAnimeStats();
        Task<AdminDashboardStatsDto> GetDashboardAnimeStats();
        Task<UserListsStatsDto> GetUserListsStatsAsync();
    }
}