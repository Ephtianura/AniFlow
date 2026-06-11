using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Application.Exceptions;
using AnimeApp.Application.Helpers;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Services
{
    public class UserService(IUserRepository users, IUnitOfWork unitOfWork, IPasswordHasher passwordHasher, IS3FileStorageService fileStorage) : IUserService
    {
        private readonly IUserRepository _usersRepository = users;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;
        private readonly IS3FileStorageService _fileStorage = fileStorage;

        /// <summary> Повертає користувача по ID </summary>
        public async Task<UserMeResponse> GetByIdAsync(int userId)
        {
            var user = await GetUserByIdAsync(userId);
            string? avatarUrl = null;
            if (user.AvatarFileName != null)
                avatarUrl = _fileStorage.GetUrl(user.AvatarFileName);

            return new UserMeResponse(
                user.Id,
                user.Nickname,
                avatarUrl,
                user.Role,
                0
            );
        }

        public async Task<UserMeResponse> GetMeAsync(int userId)
        {
            var user = await _usersRepository.GetMeAsync(userId) 
                ?? throw new NotFoundException("User", userId);

            string? avatarUrl = null;
            if (user.AvatarFileName != null)
                avatarUrl = _fileStorage.GetUrl(user.AvatarFileName);

            return new UserMeResponse(
                user.Id,
                user.Nickname,
                avatarUrl,
                user.Role,
                user.UnreadNotificationsCount

            );
        }

        

        /// <summary> Повертає користувачів за фільтрами </summary>
        public async Task<PagedResult<User>> GetFilteredAsync(UserFilter filter) => await _usersRepository.GetFilteredAsync(filter);

        /// <summary> Оновлює Аватар і Банер </summary>
        public async Task<UserUpdateFilesResponse> UpdateFilesAsync(int id, UserUpdateFilesRequest request)
        {
            var user = await GetUserByIdAsync(id);
            string? avatarUrl = null;
            string? bannerUrl = null;

            // ===================== Оновлення постера =====================
            if (request.Avatar != null)
            {
                using var stream = request.Avatar.OpenReadStream();
                var avatarFileName = await _fileStorage.UploadFileAsync(stream, request.Avatar.FileName, StoragePaths.UserAvatars);
                user.ChangeAvatarFileName(avatarFileName);
                avatarUrl = _fileStorage.GetUrl(avatarFileName);
            }

            // ===================== Оновлення банеру =====================
            if (request.Banner != null)
            {
                using var stream = request.Banner.OpenReadStream();
                var bannerFileName = await _fileStorage.UploadFileAsync(stream, request.Banner.FileName, StoragePaths.UserPosters);
                user.ChangeBannerFileName(bannerFileName);
                bannerUrl = _fileStorage.GetUrl(bannerFileName);
            }

            await _unitOfWork.SaveChangesAsync();

            return new UserUpdateFilesResponse(avatarUrl, bannerUrl);
        }


        /// <summary> Оновлює нік, пошту, пароль </summary>
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

            await _unitOfWork.SaveChangesAsync();
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

            await _unitOfWork.SaveChangesAsync();
        }

        /// <summary> Видаляє користувача </summary>
        public async Task DeleteAsync(int userId)
        {
            var user = await GetUserByIdAsync(userId);
            await _usersRepository.DeleteAsync(user);
        }

        /// <summary> Повертає користувача по ID </summary>
        public async Task<User> GetUserByIdAsync(int userId) =>
            await _usersRepository.GetByIdAsync(userId) ?? throw new NotFoundException("User", userId);
    }
}
