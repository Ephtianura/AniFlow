using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IUserAnimeRepository
    {
        Task AddAsync(UserAnime userAnime);
        Task<double> GetAverageRatingAsync(int animeId);
        Task<int> GetRatingsCountAsync(int animeId);
        Task<UserAnime?> GetUserAnimeStatusAsync(int userId, int animeId);
        Task RecalculateAnimeRatings();
        Task UpdateAsync(UserAnime userAnime);
        Task DeleteAsync(UserAnime userAnime);
    }
}