using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Services
{
    public class UserAnimeService(IUserRepository users, IAnimeRepository animes, IUserAnimeRepository usersAnimes) : IUserAnimeService
    {
        private readonly IUserRepository _usersRepository = users;
        private readonly IAnimeRepository _animesRepository = animes;
        private readonly IUserAnimeRepository _userAnimesRepository = usersAnimes;

        /// <summary>
        /// Повертає головну інформацію про профіль
        /// </summary>
        public async Task<UserProfileResponse> GetUserProfileAsync(int userId)
        {
            var user = await GetUserWithAnimeByIdAsync(userId);
            var userAnimes = user.UserAnimes;

            // Калькулятор статистики. Кількість аніме в кожному зі списків
            var (Watching, Completed, Planned, Dropped, Rewatching, TotalAnime) =
                CalculateUserStatistic(userAnimes);

            // Сума всіх переглянутих епізодів
            int totalEpisodes = userAnimes
                .Where(ua => ua.MyList == MyListEnum.Completed || ua.MyList == MyListEnum.Rewatching) // Беремо тільки ті, які ВЖЕ переглянулі, або знову дивимося
                .Sum(ua => ua.Anime.Episodes);

            // Мій середній бал
            double averageScore = userAnimes
                .Where(ua => ua.Rating.HasValue)
                .Select(ua => ua.Rating.Value)
                .DefaultIfEmpty(0)
                .Average();

            // Весь час затрачений на перегляд аніме
            TimeSpan totalTime = TimeSpan.FromMinutes(
                userAnimes
                .Where(ua => ua.MyList == MyListEnum.Completed || ua.MyList == MyListEnum.Rewatching)
                .Sum(ua => ua.Anime.Episodes * ua.Anime.Duration)
            );

            return new UserProfileResponse
            {
                // Базова інфа
                Id = user.Id,
                Nickname = user.Nickname,
                AvatarFileName = user.AvatarFileName,
                Email = user.Email,
                DateOfRegistration = user.DateOfRegistration,

                // Красиві циферки ~
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
        /// Отримати коротку сводку о кількості аніме в списках, та самих аніме
        /// </summary>
        public async Task<UserAnimeListResponse> GetUserAnimeListAsync(int userId)
        {
            var user = await GetUserWithAnimeByIdAsync(userId);

            var (Watching, Completed, Planned, Dropped, Rewatching, TotalAnime) =
                CalculateUserStatistic(user.UserAnimes);

            var animes = user.UserAnimes
                .Select(userAnimes => new AnimeInListResponse
                {
                    Id = userAnimes.Anime.Id,
                    Titles = userAnimes.Anime.Titles.Select(t => new AnimeTitleRequest
                    {
                        Value = t.Value,
                        Language = t.Language,
                        Type = t.Type
                    }).ToList(),
                    PosterFileName = userAnimes.Anime.PosterFileName,
                    Kind = userAnimes.Anime.Kind,
                    Episodes = userAnimes.Anime.Episodes,
                    Score = userAnimes.Anime.Score,
                    TotalScores = userAnimes.Anime.TotalScores,
                    MyRating = userAnimes.Rating,
                    Url = userAnimes.Anime.Url,
                })
                .ToList();

            return new UserAnimeListResponse
            {
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
        /// Повертає масив аніме з фільтром по списку
        /// </summary>
        public async Task<UserAnimeListResponse> GetUserAnimesByStatusAsync(int userId, MyListEnum? status)
        {
            if (status is null)
                throw new ArgumentNullException(nameof(status));

            var user = await GetUserWithAnimeByIdAsync(userId);

            var filteredAnimes = user.UserAnimes
                .Where(ua => ua.MyList == status)
                .ToList();

            var (Watching, Completed, Planned, Dropped, Rewatching, TotalAnime) =
                CalculateUserStatistic(filteredAnimes);

            var animes = filteredAnimes
                .Select(ua => new AnimeInListResponse
                {
                    Id = ua.Anime.Id,
                    Titles = ua.Anime.Titles.Select(t => new AnimeTitleRequest
                    {
                        Value = t.Value,
                        Language = t.Language,
                        Type = t.Type
                    }).ToList(),
                    PosterFileName = ua.Anime.PosterFileName,
                    Kind = ua.Anime.Kind,
                    Episodes = ua.Anime.Episodes,
                    Score = ua.Anime.Score,
                    TotalScores = ua.Anime.TotalScores,
                    MyRating = ua.Rating,
                    Url = ua.Anime.Url,
                })
                .ToList();

            return new UserAnimeListResponse
            {
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
            var user = await GetUserWithAnimeByIdAsync(request.UserId);
            var anime = await GetAnimeByIdAsync(request.AnimeId);

            // Перевірка наявності
            var userAnime = user.UserAnimes.FirstOrDefault(ua => ua.AnimeId == anime.Id);

            if (userAnime == null)
            {
                // Створюємо новий запис 
                userAnime = UserAnime.Create(user, anime);

                if (request.List.HasValue)
                    userAnime.MoveToList(request.List.Value);

                if (request.Rating.HasValue)
                    userAnime.Rate(request.Rating);

                user.UserAnimes.Add(userAnime);
            }
            else
            {
                // Або оновлюємо
                if (request.List.HasValue)
                    userAnime.MoveToList(request.List.Value);

                if (request.Rating.HasValue)
                    userAnime.Rate(request.Rating);
            }

            await _usersRepository.UpdateAsync(user);
        }

        /// <summary>
        /// Повертає індивідуальну оцінку та список користувача
        /// </summary>
        public async Task<UserAnimeStatus> GetUserAnimeStatusAsync(int userId, int animeId)
        {
            UserAnime? userAnime = await _userAnimesRepository.GetUserAnimeStatusAsync(userId, animeId);

            UserAnimeStatus userStatus = new(
                userAnime?.MyList,
                userAnime?.Rating
                );

            return userStatus;
        }

        /// <summary>
        /// Рахує статистику перегляду аніме користувача.
        /// </summary>
        /// <param name="userAnimes">Список аніме користувача.</param>
        /// <returns>Кортеж з шести полів:
        /// <list type="bullet">
        /// <item><c>Watching</c> — кількість аніме, які зараз дивляться</item>
        /// <item><c>Completed</c> — кількість аніме, які завершено</item>
        /// <item><c>Planned</c> — кількість аніме, які заплановані для перегляду</item>
        /// <item><c>Dropped</c> — кількість аніме, які покинули</item>
        /// <item><c>Rewatching</c> — кількість аніме, які переглядають повторно</item>
        /// <item><c>TotalAnime</c> — загальна кількість аніме у списку користувача</item>
        /// </list>
        /// </returns>
        private (int Watching, int Completed, int Planned, int Dropped, int Rewatching, int TotalAnime) 
            CalculateUserStatistic(ICollection<UserAnime> userAnimes)
        {
            if (userAnimes == null || userAnimes.Count == 0)
                return (0, 0, 0, 0, 0, 0);

            int watching = userAnimes.Count(ua => ua.MyList == MyListEnum.Watching);
            int completed = userAnimes.Count(ua => ua.MyList == MyListEnum.Completed);
            int planned = userAnimes.Count(ua => ua.MyList == MyListEnum.Planned);
            int dropped = userAnimes.Count(ua => ua.MyList == MyListEnum.Dropped);
            int rewatching = userAnimes.Count(ua => ua.MyList == MyListEnum.Rewatching);

            int totalAnime = userAnimes.Count;

            return (watching, completed, planned, dropped, rewatching, totalAnime);
        }

        /// <summary>
        /// Повертає користувача по ID
        /// </summary>
        public async Task<User> GetUserByIdAsync(int userId) =>
            await _usersRepository.GetByIdAsync(userId) ?? throw new EntityNotFoundException("User", userId);

        /// <summary>
        /// Повертає користувача по ID із списком його аніме
        /// </summary>
        public async Task<User> GetUserWithAnimeByIdAsync(int userId) =>
             await _usersRepository.GetWithAnimeListAsync(userId) ?? throw new EntityNotFoundException("User", userId);

        /// <summary>
        /// Повертає сутніть аніме
        /// </summary>
        private async Task<Anime> GetAnimeByIdAsync(int animeId) =>
           await _animesRepository.GetByIdAsync(animeId) ?? throw new EntityNotFoundException("Anime", animeId);
    }
}
