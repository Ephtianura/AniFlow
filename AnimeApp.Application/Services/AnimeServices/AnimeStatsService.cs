using AnimeApp.Application.Contracts.App;
using AnimeApp.Core.Contracts;

namespace AnimeApp.Application.Services.AnimeServices
{
    public class AnimeStatsService(IUserAnimeRepository userAnimeRepository, IDashboardRepository dashboardRepository) : IAnimeStatsService
    {
        private readonly IUserAnimeRepository _userAnimeRepository = userAnimeRepository;
        private readonly IDashboardRepository _dashboardRepository = dashboardRepository;

        public Task RecalculateAnimeStats() => _userAnimeRepository.RecalculateAnimeRatings();

        public Task<AdminDashboardStatsDto> GetDashboardAnimeStats() => _dashboardRepository.GetAdminDashboardStatsAsync();

        public Task<UserListsStatsDto> GetUserListsStatsAsync() => _userAnimeRepository.GetUserListsStatsAsync();
    }
}
