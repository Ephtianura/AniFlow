using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Services
{
    public class UserService(IUserRepository users, IPasswordHasher passwordHasher, IS3FileStorageService fileStorage, IAnimeRepository animes) : IUserService

    {
        private readonly IUserRepository _users = users;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly IAnimeRepository _animes = animes;

        // Отримати користувача по ID
        public async Task<User> GetByIdAsync(int userId) => await GetUserByIdAsync(userId);

        // Отримати користувачів за філтрами
        public async Task<PagedResult<User>> GetFilteredAsync(UserFilter filter) => await _users.GetFilteredAsync(filter);

        public async Task<UserProfileResponse> GetUserProfileAsync(int userId)
        {
            var user = await GetUserWithAnimeByIdAsync(userId);
            var userAnimes = user.UserAnimes;

            // Используем базовый калькулятор статистики
            var (Watching, Completed, Planned, Dropped, Rewatching, TotalAnime) =
                CalculateUserStatistic(userAnimes);

            // Дополнительная логика
            int totalEpisodes = userAnimes.Sum(ua => ua.Anime.Episodes);

            double averageScore = userAnimes
                .Where(ua => ua.Rating.HasValue)
                .Select(ua => ua.Rating.Value)
                .DefaultIfEmpty(0)
                .Average();

            TimeSpan totalTime = TimeSpan.FromMinutes(
                userAnimes.Sum(ua => ua.Anime.Episodes * ua.Anime.Duration)
            );

            return new UserProfileResponse
            {
                Id = user.Id,
                Nickname = user.Nickname,
                AvatarFileName = user.AvatarFileName,
                Email = user.Email,
                DateOfRegistration = user.DateOfRegistration,

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

        
        public async Task AddOrUpdateAnimeAsync(UpdateUserRatingOrList request)
        {
            var user = await GetUserWithAnimeByIdAsync(request.UserId);
            var anime = await GetAnimeByIdAsync(request.AnimeId);

            // Проверяем, есть ли запись
            var userAnime = user.UserAnimes.FirstOrDefault(ua => ua.AnimeId == anime.Id);

            if (userAnime == null)
            {
                // Создаём новую запись
                userAnime = UserAnime.Create(user, anime);

                if (request.List.HasValue)
                    userAnime.ChangeMyList(request.List.Value);

                if (request.Rating.HasValue)
                    userAnime.ChangeRating(request.Rating);

                user.UserAnimes.Add(userAnime);
            }
            else
            {
                // Обновляем существующую запись
                if (request.List.HasValue)
                    userAnime.ChangeMyList(request.List.Value);

                if (request.Rating.HasValue)
                    userAnime.ChangeRating(request.Rating);
            }

            await _users.UpdateAsync(user);
        }

        public async Task<User> UpdateFilesAsync(int id, UserUpdateFilesRequest request)
        {
            var user = await GetUserByIdAsync(id);

            // ===================== Обновление постера =====================
            if (request.Avatar != null)
            {
                using var stream = request.Avatar.OpenReadStream();
                var posterFileName = await _fileStorage.UploadFileAsync(stream, request.Avatar.FileName, "user-avatars");
                user.ChangeAvatarFileName(posterFileName);
            }
            else if (!string.IsNullOrWhiteSpace(request.AvatarUrl))
            {
                try
                {
                    using var http = new HttpClient();
                    var response = await http.GetAsync(request.AvatarUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        var bytes = await response.Content.ReadAsByteArrayAsync();
                        var ext = response.Content.Headers.ContentType?.MediaType switch
                        {
                            "image/png" => ".png",
                            "image/webp" => ".webp",
                            _ => ".jpg"
                        };

                        var fileName = $"{Guid.NewGuid()}{ext}";
                        using var ms = new MemoryStream(bytes);
                        var saved = await _fileStorage.UploadFileAsync(ms, fileName, "user-avatars");
                        user.ChangeAvatarFileName(saved);
                    }
                }
                catch
                {
                }
            }

            await _users.UpdateAsync(user);
            return user;
        }


        // Оновити профіль користувача
        public async Task UpdateProfileAsync(int userId, UserUpdateRequest request)
        {
            var user = await GetUserByIdAsync(userId);

            if (!string.IsNullOrEmpty(request.Nickname) && request.Nickname != user.Nickname)
                user.ChangeNickname(request.Nickname);
            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                var existing = await _users.GetByEmailAsync(request.Email.Trim().ToLower());
                if (existing != null && existing.Id != userId)
                    throw new EmailAlreadyExistsException(request.Email);

                user.ChangeEmail(request.Email.Trim().ToLower());
            }
            if (!string.IsNullOrEmpty(request.Password))
                user.ChangePassword(_passwordHasher.Generate(request.Password));
            if (request.Theme.HasValue && request.Theme != user.Theme)
                user.ChangeTheme(request.Theme.Value);

            await _users.UpdateAsync(user);
        }

        public async Task UserUpdateByAdminAsync(int userId, UserUpdateAdminRequest request)
        {
            var user = await GetUserByIdAsync(userId);

            if (!string.IsNullOrEmpty(request.Nickname) && request.Nickname != user.Nickname)
                user.ChangeNickname(request.Nickname);
            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                var existing = await _users.GetByEmailAsync(request.Email.Trim().ToLower());
                if (existing != null && existing.Id != userId)
                    throw new EmailAlreadyExistsException(request.Email);

                user.ChangeEmail(request.Email.Trim().ToLower());
            }
            if (request.Role.HasValue && request.Role != user.Role)
                user.ChangeRole(request.Role.Value);

            await _users.UpdateAsync(user);
        }

        // Видалити користувача
        public async Task DeleteAsync(int userId)
        {
            var user = await GetUserByIdAsync(userId);
            await _users.DeleteAsync(user);
        }

        // Отримати користувача по ID
        public async Task<User> GetUserByIdAsync(int userId) =>
            await _users.GetByIdAsync(userId) ?? throw new EntityNotFoundException("User", userId);

        // Отримати користувача по ID із списком його аніме
        public async Task<User> GetUserWithAnimeByIdAsync(int userId)
        {
            return await _users.GetWithAnimeListAsync(userId) ?? throw new EntityNotFoundException("User", userId);
        }

        private async Task<Anime> GetAnimeByIdAsync(int id)
        {
            var anime = await _animes.GetByIdAsync(id);
            if (anime is null)
                throw new EntityNotFoundException("Anime", id);
            return anime;
        }
    }
}
