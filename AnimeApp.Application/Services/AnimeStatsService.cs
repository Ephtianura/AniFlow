using AnimeApp.Application.Contracts;
using AnimeApp.Core.Contracts;

namespace AnimeApp.Application.Services
{
    public class AnimeStatsService(IUserAnimeRepository userAnimeRepository) : IAnimeStatsService
    {
        private readonly IUserAnimeRepository _userAnimeRepository = userAnimeRepository;
        public async Task RecalculateAnimeStats() =>
            await _userAnimeRepository.RecalculateAnimeRatings();
    }
}
