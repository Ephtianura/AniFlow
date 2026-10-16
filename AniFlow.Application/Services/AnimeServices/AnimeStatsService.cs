using AniFlow.Application.Contracts.App;
using AniFlow.Core.Contracts;
using AniFlow.Core.Dto;

namespace AniFlow.Application.Services.AnimeServices
{
    public class AnimeStatsService(IUserAnimeRepository userAnimeRepository, IStatsRepository dashboardRepository) : IAnimeStatsService
    {
        private readonly IUserAnimeRepository _userAnimeRepository = userAnimeRepository;
        private readonly IStatsRepository _dashboardRepository = dashboardRepository;

        public Task RecalculateAnimeStats() => _userAnimeRepository.RecalculateAnimeRatings();

        public Task<AdminAnimeStatsDto> GetDashboardAnimeStats() => _dashboardRepository.GetAdminAnimeStatsAsync();

        public Task<UserListsStatsDto> GetUserListsStatsAsync() => _userAnimeRepository.GetUserListsStatsAsync();
    }
}
