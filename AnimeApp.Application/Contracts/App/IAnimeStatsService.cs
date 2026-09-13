using AnimeApp.Core.Contracts;
using AnimeApp.Core.Dto;

namespace AnimeApp.Application.Contracts.App
{
    public interface IAnimeStatsService
    {
        Task RecalculateAnimeStats();
        Task<AdminAnimeStatsDto> GetDashboardAnimeStats();
        Task<UserListsStatsDto> GetUserListsStatsAsync();
    }
}