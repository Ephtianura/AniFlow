using AnimeApp.Core.Contracts;

namespace AnimeApp.Application.Contracts.App
{
    public interface IAnimeStatsService
    {
        Task RecalculateAnimeStats();
        Task<AdminAnimeStatsDto> GetDashboardAnimeStats();
        Task<UserListsStatsDto> GetUserListsStatsAsync();
    }
}