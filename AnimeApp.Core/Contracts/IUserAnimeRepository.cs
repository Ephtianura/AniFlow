using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IUserAnimeRepository
    {
        Task<double> GetAverageRatingAsync(int animeId);
        Task<int> GetRatingsCountAsync(int animeId);
        Task<UserAnime?> GetUserAnimeStatusAsync(int userId, int animeId);
        Task RecalculateAnimeRatings();
    }
}