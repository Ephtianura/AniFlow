using AnimeApp.Application.Dto.Anime;
using AnimeApp.Application.Dto.User;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts
{
    public interface IUserService
    {
        Task AddOrUpdateAnimeAsync(int userId, Anime anime, MyListEnum? list = null, int? rating = null);
        Task DeleteAsync(int userId);
        Task<User> GetByIdAsync(int userId);
        Task<PagedResult<User>> GetFilteredAsync(UserFilter filter);
        Task<UserAnimeListResponse> GetUserAnimeListAsync(int userId);
        Task<UserAnimeListResponse> GetUserAnimesByStatusAsync(int userId, MyListEnum? status);
        Task<User> GetUserByIdAsync(int userId);
        Task<UserProfileResponse> GetUserProfileAsync(int userId);
        Task<User> GetUserWithAnimeByIdAsync(int userId);
        Task UpdateProfileAsync(int userId, UserUpdateRequest request);
        Task UserUpdateByAdminAsync(int userId, UserUpdateAdminRequest request);
    }
}