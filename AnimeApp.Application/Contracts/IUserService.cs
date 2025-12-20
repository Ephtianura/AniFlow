using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Application.Services;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts
{
    public interface IUserService
    {
        Task AddOrUpdateAnimeAsync(UpdateUserRatingOrList request);
        Task DeleteAsync(int userId);
        Task<User> GetByIdAsync(int userId);
        Task<PagedResult<User>> GetFilteredAsync(UserFilter filter);
        Task<UserAnimeListResponse> GetUserAnimeListAsync(int userId);
        Task<UserAnimeListResponse> GetUserAnimesByStatusAsync(int userId, MyListEnum? status);
        Task<User> GetUserByIdAsync(int userId);
        Task<UserProfileResponse> GetUserProfileAsync(int userId);
        Task<User> GetUserWithAnimeByIdAsync(int userId);
        Task<User> UpdateFilesAsync(int id, UserUpdateFilesRequest request);
        Task UpdateProfileAsync(int userId, UserUpdateRequest request);
        Task UserUpdateByAdminAsync(int userId, UserUpdateAdminRequest request);
    }
}