using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AnimeApp.DataAccess.Repositories
{
    public class UserAnimeRepository(AnimeAppDbContext db) : IUserAnimeRepository
    {
        private readonly AnimeAppDbContext _dbContext = db;

        /// <summary>
        /// Повертає середню оцінку одного аніме
        /// </summary>
        public async Task<double> GetAverageRatingAsync(int animeId)
            => await _dbContext.UserAnimes
                .Where(userAnime => userAnime.AnimeId == animeId && userAnime.Rating.HasValue)
                .AverageAsync(userAnime => (double)userAnime.Rating!.Value);

        /// <summary>
        /// Повертає спільну кількість оцінок у одного аніме
        /// </summary>
        public async Task<int> GetRatingsCountAsync(int animeId)
            => await _dbContext.UserAnimes
                .CountAsync(userAnime => userAnime.AnimeId == animeId && userAnime.Rating.HasValue);

        /// <summary>
        /// Виконує пошук оцінки користувача по составному ключу
        /// </summary>
        public async Task<UserAnime?> GetUserAnimeStatusAsync(int userId, int animeId) =>
            await _dbContext.UserAnimes.FindAsync(userId, animeId);

        /// <summary>
        /// Перераховує середній рейтинг для кожного з аніме в базі (Одним запитом до БД)
        /// </summary>
        public async Task RecalculateAnimeRatings()
        {
            // Отримуємо статистику
            var stats = await _dbContext.UserAnimes
                .Where(ua => ua.Rating.HasValue) // Вибрати всі оцінені аніме
                .GroupBy(ua => ua.AnimeId) // Сгрупувати по айді ( 1: [9, 8 , 10] )
                .Select(g => new
                {
                    AnimeId = g.Key,
                    Count = g.Count(),
                    Avg = g.Average(x => x.Rating!.Value)
                })
                .ToListAsync();

            // Переводимо в список
            var statsDict = stats.ToDictionary(s => s.AnimeId);

            var animes = await _dbContext.Animes
                .AsTracking()
                .ToListAsync();

            foreach (var anime in animes)
            {
                if (statsDict.TryGetValue(anime.Id, out var stat))
                {
                    anime.UpdateTotalScores(stat.Count);
                    anime.Rate(stat.Avg);
                }
                else
                {
                    anime.UpdateTotalScores(0);
                    anime.Rate(0);
                }
            }

            await _dbContext.SaveChangesAsync();
        }
    }
}
