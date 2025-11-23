using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;


namespace AnimeApp.DataAccess.Repositories
{
    public class UserAnimeRepository : IUserAnimeRepository
    {
        private readonly AnimeAppDbContext _dbContext;
        public UserAnimeRepository(AnimeAppDbContext db) => _dbContext = db;

        // Середня оцінка одного аніме
        public async Task<double> GetAverageRatingAsync(int animeId)
            => await _dbContext.UserAnimes
                .Where(userAnime => userAnime.AnimeId == animeId && userAnime.Rating.HasValue)
                .AverageAsync(userAnime => (double)userAnime.Rating.Value);

        // Обща кількість оцінок у одного аніме
        public async Task<int> GetRatingsCountAsync(int animeId)
            => await _dbContext.UserAnimes
                .CountAsync(userAnime => userAnime.AnimeId == animeId && userAnime.Rating.HasValue);
    }

}
