using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;
using MassTransit;

namespace AnimeApp.Application.Services
{
    public class UserAnimeService(
        IUserRepository users,
        IUserAnimeRepository usersAnimes,
        IS3FileStorageService fileStorage) : IUserAnimeService
    {
        private readonly IUserRepository _usersRepo = users;
        private readonly IUserAnimeRepository _userAnimesRepo = usersAnimes;
        private readonly IS3FileStorageService _fileStorage = fileStorage;


        /// <summary>Повертає всю інформацію про профіль </summary>
        public async Task<UserProfileResponse> GetUserProfileAsync(int userId)
        {
            var user = await _usersRepo.GetByIdAsync(userId) ?? throw new NotFoundException("User");

            var userAnimes = await _userAnimesRepo.GetStatsDataByUserIdAsync(userId);

            // Калькулятор статистики. Кількість аніме в кожному зі списків
            var (Favorites, Watching, Completed, Planned, Dropped, Rewatching, TotalAnime) =
               CalculateUserStatistic(userAnimes);

            // Сума всіх переглянутих епізодів
            int totalEpisodes = userAnimes
                .Where(ua => ua.AnimeEpisodes.HasValue && (ua.MyList == MyListEnum.Completed || ua.MyList == MyListEnum.Rewatching))
                .Sum(ua => ua.AnimeEpisodes!.Value);

            // "Мій середній бал"
            double averageScore = userAnimes
                .Where(ua => ua.Rating.HasValue)
                .Select(ua => ua.Rating!.Value)
                .DefaultIfEmpty(0)
                .Average();

            averageScore = Math.Round(averageScore, 1);

            // Весь час затрачений на перегляд аніме
            TimeSpan totalTime = TimeSpan.FromMinutes(userAnimes
                .Where(ua => ua.AnimeEpisodes.HasValue && ua.AnimeDuration.HasValue && (ua.MyList == MyListEnum.Completed || ua.MyList == MyListEnum.Rewatching))
                .Sum(ua => ua.AnimeEpisodes!.Value * ua.AnimeDuration!.Value)
            );

            string? avatarUrl = null;
            string? bannerUrl = null;
            if (!string.IsNullOrWhiteSpace(user.AvatarFileName))
                avatarUrl = _fileStorage.GetUrl(user.AvatarFileName);

            if (!string.IsNullOrWhiteSpace(user.BannerFileName))
                bannerUrl = _fileStorage.GetUrl(user.BannerFileName);

            return new UserProfileResponse
            {
                // Базова інфа
                Id = user.Id,
                Nickname = user.Nickname,
                AvatarUrl = avatarUrl,
                BannerUrl = bannerUrl,
                Email = user.Email,
                DateOfRegistration = user.DateOfRegistration,

                // Красиві циферки ~
                Favorites = Favorites,
                Watching = Watching,
                Completed = Completed,
                Planned = Planned,
                Dropped = Dropped,
                Rewatching = Rewatching,
                TotalAnime = TotalAnime,
                TotalEpisodes = totalEpisodes,
                AverageScore = averageScore,
                TimeSpent = totalTime
            };
        }

        /// <summary>
        /// Повертає масив аніме з фільтром по списку
        /// </summary>
        public async Task<UserAnimeListResponse> GetUserAnimesAsync(int userId, MyListEnum? status, bool? isFavorite = null)
        {
            var filteredData = await _userAnimesRepo.GetAllUserStatusWithDetailsAsync(userId, status, isFavorite);
            var statsData = await _userAnimesRepo.GetStatsDataByUserIdAsync(userId);

            // Калькулятор статистики. Кількість аніме в кожному зі списків
            var (Favorites, Watching, Completed, Planned, Dropped, Rewatching, TotalAnime) =
                CalculateUserStatistic(statsData);
            var animes = filteredData
                .ConvertAll(ua => new AnimeInListResponse
                {
                    IsFavorite = ua.IsFavorite,
                    MyRating = ua.Rating,
                    MyList = ua.MyList,

                    Id = ua.Anime.Id,
                    Titles = ua.Anime.Titles
                        .ConvertAll(t => new AnimeTitleRequest
                        {
                            Value = t.Value,
                            Language = t.Language,
                            Type = t.Type
                        }),

                    PosterUrl = !string.IsNullOrEmpty(ua.Anime.PosterFileName)
                        ? _fileStorage.GetUrl(ua.Anime.PosterFileName)
                        : null,
                    Kind = ua.Anime.Kind,
                    Episodes = ua.Anime.Episodes,
                    Score = ua.Anime.Score,
                    TotalScores = ua.Anime.TotalScores,
                    Url = ua.Anime.Url,
                });

            return new UserAnimeListResponse
            {
                Favorites = Favorites,
                Watching = Watching,
                Completed = Completed,
                Planned = Planned,
                Dropped = Dropped,
                Rewatching = Rewatching,
                TotalAnime = TotalAnime,
                Animes = animes
            };
        }

        /// <summary>
        /// Оновлює власний рейтинг/список, або створює якщо неммає
        /// </summary>
        public async Task UpdateAnimeStatusAsync(UpdateUserAnimeCommand request)
        {

            // Перевірка наявності
            var userAnime = await _userAnimesRepo.GetUserAnimeStatusAsync(request.UserId, request.AnimeId);

            if (userAnime == null)
            {
                // Створюємо новий запис 
                userAnime = UserAnime.Create(request.UserId, request.AnimeId);

                if (request.List.HasValue)
                    userAnime.MoveToList(request.List.Value);
                if (request.Rating.HasValue)
                    userAnime.Rate(request.Rating);
                if (request.IsFavorite is true)
                    userAnime.MarkAsFavorites();

                await _userAnimesRepo.AddAsync(userAnime);
            }
            else
            {
                // Або оновлюємо
                if (request.List.HasValue)
                    userAnime.MoveToList(request.List.Value);
                if (request.Rating.HasValue)
                    userAnime.Rate(request.Rating);
                if (request.IsFavorite is true)
                    userAnime.MarkAsFavorites();

                await _userAnimesRepo.UpdateAsync(userAnime);
            }

        }

        /// <summary>
        /// Видаляє аніме статус користувача
        /// </summary>
        public async Task RemoveUserStatusAsync(int userId, int animeId, DeleteStatusTargets target)
        {
            UserAnime? userAnime = await _userAnimesRepo.GetUserAnimeStatusAsync(userId, animeId);
            if (userAnime == null) return;

            if (target.Rating)
                userAnime.Rate(null);
            if (target.MyList)
                userAnime.MoveToList(null);
            if (target.IsFavorite)
                userAnime.RemoveFromFavorites();

            // Якщо рядок пустий, видаляємо, інакше оновлюємо
            if (userAnime.IsEmpty())
                await _userAnimesRepo.DeleteAsync(userAnime);
            else
                await _userAnimesRepo.UpdateAsync(userAnime);
        }

        /// <summary>
        /// Повертає індивідуальну оцінку та список користувача
        /// </summary>
        public async Task<UserAnimeStatus> GetUserAnimeStatusAsync(int userId, int animeId)
        {
            UserAnime? userAnime = await _userAnimesRepo.GetUserAnimeStatusAsync(userId, animeId);

            if (userAnime == null)
                return new(animeId, null, null, null);

            return new(
                userAnime.AnimeId,
                userAnime.MyList,
                userAnime.Rating,
                userAnime.IsFavorite
            );
        }

        // =================== private methods ===================

        /// <summary>
        /// Рахує статистику перегляду аніме користувача.
        /// </summary>
        /// <param name="userAnimes">Список аніме користувача.</param>
        /// <returns>Кортеж з семи полів:
        /// <list type="bullet">
        /// <item><c>Favorites</c> — кількість улюблених аніме</item>
        /// <item><c>Watching</c> — кількість аніме, які зараз дивляться</item>
        /// <item><c>Completed</c> — кількість аніме, які завершено</item>
        /// <item><c>Planned</c> — кількість аніме, які заплановані для перегляду</item>
        /// <item><c>Dropped</c> — кількість аніме, які покинули</item>
        /// <item><c>Rewatching</c> — кількість аніме, які переглядають повторно</item>
        /// <item><c>TotalAnime</c> — загальна кількість аніме у списку користувача</item>
        /// </list>
        /// </returns>
        private static (int Favorites, int Watching, int Completed, int Planned, int Dropped, int Rewatching, int TotalAnime)
            CalculateUserStatistic(ICollection<UserAnimeStatsData> userAnimes)
        {
            if (userAnimes == null || userAnimes.Count == 0)
                return (0, 0, 0, 0, 0, 0, 0);

            int favorites = userAnimes.Count(ua => ua.IsFavorite);
            int watching = userAnimes.Count(ua => ua.MyList == MyListEnum.Watching);
            int completed = userAnimes.Count(ua => ua.MyList == MyListEnum.Completed);
            int planned = userAnimes.Count(ua => ua.MyList == MyListEnum.Planned);
            int dropped = userAnimes.Count(ua => ua.MyList == MyListEnum.Dropped);
            int rewatching = userAnimes.Count(ua => ua.MyList == MyListEnum.Rewatching);

            int totalAnime = userAnimes.Count;

            return (favorites, watching, completed, planned, dropped, rewatching, totalAnime);
        }
    }
}
