using AniFlow.Core.Contracts;
using AniFlow.Core.Dto;

namespace AniFlow.Application.Contracts.App
{
    public interface IAnimeStatsService
    {
        Task RecalculateAnimeStats();
        Task<AdminAnimeStatsDto> GetDashboardAnimeStats();
        Task<UserListsStatsDto> GetUserListsStatsAsync();
    }
}