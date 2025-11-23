using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IUserAnimeRepository
    {
        //Task AddAsync(UserAnime userAnime);
        //Task DeleteAsync(UserAnime userAnime);
        //Task<UserAnime?> GetAsync(int userId, int animeId);
        Task<double> GetAverageRatingAsync(int animeId);
        Task<int> GetRatingsCountAsync(int animeId);
        //Task<IEnumerable<UserAnime>> GetByStatusAsync(int userId, MyListEnum status);
        
        //Task<IEnumerable<UserAnime>> GetUserAnimeListAsync(int userId);
        //Task UpdateAsync(UserAnime userAnime);
    }
}