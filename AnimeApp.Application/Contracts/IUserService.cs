using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts
{
    public interface IUserService
    {
        Task DeleteAsync(int userId);
        Task<User> GetByIdAsync(int userId);
        Task<PagedResult<User>> GetFilteredAsync(UserFilter filter);
        Task<User> GetUserByIdAsync(int userId);
        Task<User> UpdateFilesAsync(int id, UserUpdateFilesRequest request);
        Task UpdateProfileAsync(int userId, UserUpdateRequest request);
        Task UserUpdateByAdminAsync(int userId, UserUpdateAdminRequest request);
    }
}