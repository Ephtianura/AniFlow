using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Services
{
    public class UserService(IUserRepository users, IPasswordHasher passwordHasher, IS3FileStorageService fileStorage) : IUserService
    {
        private readonly IUserRepository _usersRepository = users;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;
        private readonly IS3FileStorageService _fileStorage = fileStorage;

        /// <summary>
        /// Повертає користувача по ID
        /// </summary>
        public async Task<User> GetByIdAsync(int userId) => await GetUserByIdAsync(userId);

        /// <summary>
        /// Повертає користувачів за фільтрами
        /// </summary>
        public async Task<PagedResult<User>> GetFilteredAsync(UserFilter filter) => await _usersRepository.GetFilteredAsync(filter);

        /// <summary>
        /// Оновити Аватар
        /// </summary>
        public async Task<User> UpdateFilesAsync(int id, UserUpdateFilesRequest request)
        {
            var user = await GetUserByIdAsync(id);

            // ===================== Оновлення постера =====================
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

            await _usersRepository.UpdateAsync(user);
            return user;
        }


        /// <summary>
        /// Оновити нік пошту пароль
        /// </summary>
        public async Task UpdateProfileAsync(int userId, UserUpdateRequest request)
        {
            var user = await GetUserByIdAsync(userId);

            if (!string.IsNullOrEmpty(request.Nickname) && request.Nickname != user.Nickname)
                user.ChangeNickname(request.Nickname);
            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                var existing = await _usersRepository.GetByEmailAsync(request.Email.Trim().ToLower());
                if (existing != null && existing.Id != userId)
                    throw new EmailAlreadyExistsException(request.Email);

                user.ChangeEmail(request.Email.Trim().ToLower());
            }
            if (!string.IsNullOrEmpty(request.Password))
                user.ChangePassword(_passwordHasher.Generate(request.Password));
            if (request.Theme.HasValue && request.Theme != user.Theme)
                user.ChangeTheme(request.Theme.Value);

            await _usersRepository.UpdateAsync(user);
        }

        public async Task UserUpdateByAdminAsync(int userId, UserUpdateAdminRequest request)
        {
            var user = await GetUserByIdAsync(userId);

            if (!string.IsNullOrEmpty(request.Nickname) && request.Nickname != user.Nickname)
                user.ChangeNickname(request.Nickname);
            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                var existing = await _usersRepository.GetByEmailAsync(request.Email.Trim().ToLower());
                if (existing != null && existing.Id != userId)
                    throw new EmailAlreadyExistsException(request.Email);

                user.ChangeEmail(request.Email.Trim().ToLower());
            }
            if (request.Role.HasValue && request.Role != user.Role)
                user.ChangeRole(request.Role.Value);

            await _usersRepository.UpdateAsync(user);
        }

        /// <summary>
        /// Видалити користувача
        /// </summary>
        public async Task DeleteAsync(int userId)
        {
            var user = await GetUserByIdAsync(userId);
            await _usersRepository.DeleteAsync(user);
        }

        /// <summary>
        /// Повертає користувача по ID
        /// </summary>
        public async Task<User> GetUserByIdAsync(int userId) =>
            await _usersRepository.GetByIdAsync(userId) ?? throw new EntityNotFoundException("User", userId);
    }
}
