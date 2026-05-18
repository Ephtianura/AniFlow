using AnimeApp.Application.Contracts.App;
using AnimeApp.Core.Contracts;

namespace AnimeApp.Application.Services.AnimeServices
{
    public class AnimeStatsService(IUserAnimeRepository userAnimeRepository) : IAnimeStatsService
    {
        private readonly IUserAnimeRepository _userAnimeRepository = userAnimeRepository;
        public async Task RecalculateAnimeStats() =>
            await _userAnimeRepository.RecalculateAnimeRatings();
    }
}
