using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IUserAnimeRepository
    {
        /// <summary> Повертає середню оцінку одного аніме </summary>
        Task<double> GetAverageRatingAsync(int animeId);

        /// <summary> Повертає спільну кількість оцінок у одного аніме </summary>
        Task<int> GetRatingsCountAsync(int animeId);

        /// <summary> Виконує пошук оцінки/списка користувача по составному ключу </summary>
        Task<UserAnime?> GetUserAnimeStatusAsync(int userId, int animeId);

        /// <summary> Перераховує середній рейтинг для кожного з аніме в базі </summary>
        Task RecalculateAnimeRatings();

        Task AddAsync(UserAnime userAnime);
        Task UpdateAsync(UserAnime userAnime);
        Task DeleteAsync(UserAnime userAnime);
        Task<List<UserAnime>> GetAllUserStatus(int userId, MyListEnum? list);
        Task<List<UserAnimeStatsData>> GetStatsDataByUserIdAsync(int userId);
        Task<List<UserAnimeWithDetails>> GetAllUserStatusWithDetailsAsync(int userId, MyListEnum? status, bool? isFavorite);
    }
}