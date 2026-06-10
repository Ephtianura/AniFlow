using AnimeApp.Core.Contracts;
using AnimeApp.Core.Dto;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AnimeApp.DataAccess.Repositories
{
    public class UserAnimeRepository(AnimeAppDbContext db) : IUserAnimeRepository
    {
        private readonly AnimeAppDbContext _dbContext = db;

        public async Task<double> GetAverageRatingAsync(int animeId)
            => await _dbContext.UserAnimes
                .Where(userAnime => userAnime.AnimeId == animeId && userAnime.Rating.HasValue)
                .AverageAsync(userAnime => (double)userAnime.Rating!.Value);

        public async Task<int> GetRatingsCountAsync(int animeId)
            => await _dbContext.UserAnimes
                .CountAsync(userAnime => userAnime.AnimeId == animeId && userAnime.Rating.HasValue);

        public async Task<UserAnime?> GetUserAnimeStatusAsync(int userId, int animeId) =>
            await _dbContext.UserAnimes.FindAsync(userId, animeId);

        public async Task<List<UserAnime>> GetAllUserStatus(int userId, MyListEnum? list) =>
            await _dbContext.UserAnimes
                .Where(ua => ua.UserId == userId &&
                             (!list.HasValue || ua.MyList == list))
                .ToListAsync();

        public async Task<List<UserAnimeStatsData>> GetStatsDataByUserIdAsync(int userId) =>
                     await (from ua in _dbContext.UserAnimes
                            join a in _dbContext.Animes on ua.AnimeId equals a.Id
                            where ua.UserId == userId
                            select new UserAnimeStatsData(ua.MyList, ua.Rating, ua.IsFavorite, a.Episodes, a.Duration))
                         .ToListAsync();

        public async Task<List<UserAnimeWithDetails>> GetAllUserStatusWithDetailsAsync(int userId, MyListEnum? status, bool? isFavorite = null)
        {
            var query = from ua in _dbContext.UserAnimes
                        join a in _dbContext.Animes on ua.AnimeId equals a.Id
                        where ua.UserId == userId
                        select new { ua, a };

            if (status.HasValue)
                query = query.Where(x => x.ua.MyList == status.Value);

            if (isFavorite.HasValue)
                query = query.Where(x => x.ua.IsFavorite == isFavorite.Value);

            return await query
                .AsNoTracking()
                .Select(x => new UserAnimeWithDetails(
                    x.ua.MyList,
                    x.ua.Rating,
                    x.ua.IsFavorite,
                    new AnimeDto(
                        x.a.Id,
                        x.a.PosterFileName,
                        x.a.Kind,
                        x.a.Episodes,
                        x.a.Score,
                        x.a.TotalScores,
                        x.a.Url,
                        x.a.Titles
                    )
                ))
                .ToListAsync();
        }

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
                }
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task<UserListsStatsDto> GetUserListsStatsAsync()
        {
            var listGroupedData = await _dbContext.UserAnimes
                .Where(ua => ua.MyList.HasValue)
                .GroupBy(ua => ua.MyList!.Value)
                .Select(g => new UserListTypeStatItem(g.Key, g.Count()))
                .ToListAsync();

            var totalFavorites = await _dbContext.UserAnimes.CountAsync(ua => ua.IsFavorite);
            var totalRated = await _dbContext.UserAnimes.CountAsync(ua => ua.Rating != null);

            return new UserListsStatsDto
            {
                TotalFavoritesCount = totalFavorites,
                TotalRatedCount = totalRated,
                ByListType = listGroupedData
            };
        }

        public async Task<UserRawResponse?> GetUsersProfileById(int userId)
        {
            var userBase = await _dbContext.Users
                .Where(u => u.Id == userId)
                .Select(u => new { u.Id, u.Nickname, u.AvatarFileName, u.BannerFileName, u.DateOfRegistration, u.LastOnline })
                .FirstOrDefaultAsync();

            if (userBase == null) return null;

            var rawAnimeData = await _dbContext.UserAnimes
                .Where(ua => ua.UserId == userId)
                .Join(_dbContext.Animes,
                    ua => ua.AnimeId,
                    a => a.Id,
                    (ua, a) => new
                    {
                        ua.MyList,
                        ua.Rating,
                        Episodes = a.Episodes ?? 0,
                        Duration = a.Duration ?? 0
                    })
                .ToListAsync(); 

            var completedOrRewatching = rawAnimeData
                .Where(x => x.MyList == MyListEnum.Completed || x.MyList == MyListEnum.Rewatching)
                .ToList();

            var totalEpisodes = completedOrRewatching.Sum(x => x.Episodes);
            var timeSpentMinutes = completedOrRewatching.Sum(x => x.Episodes * x.Duration);

            var ratings = rawAnimeData
                .Where(x => x.Rating != null)
                .Select(x => (double)x.Rating!.Value)
                .ToList();

            var averageScore = ratings.Any() ? Math.Round(ratings.Average(), 1) : 0.0;

            return new UserRawResponse
            {
                Id = userBase.Id,
                Nickname = userBase.Nickname,
                AvatarFileName = userBase.AvatarFileName,
                BannerFileName = userBase.BannerFileName,
                LastOnline = userBase.LastOnline,
                DateOfRegistration = userBase.DateOfRegistration,
                TotalEpisodes = totalEpisodes,
                AverageScore = averageScore,
                TimeSpentMinutes = timeSpentMinutes
            };
        }

        public async Task AddAsync(UserAnime userAnime)
        {
            await _dbContext.UserAnimes.AddAsync(userAnime);
            await _dbContext.SaveChangesAsync();
        }
        public async Task UpdateAsync(UserAnime userAnime)
        {
            _dbContext.UserAnimes.Update(userAnime);
            await _dbContext.SaveChangesAsync();
        }
        public async Task DeleteAsync(UserAnime userAnime)
        {
            _dbContext.UserAnimes.Remove(userAnime);
            await _dbContext.SaveChangesAsync();
        }
    }
}
