using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts.App
{
    public interface IUserService
    {
        Task DeleteAsync(int userId);
        Task<GetUserMeResponse> GetByIdAsync(int userId);
        Task<PagedResult<User>> GetFilteredAsync(UserFilter filter);
        Task<User> GetUserByIdAsync(int userId);
        Task<UserUpdateFilesResponse> UpdateFilesAsync(int id, UserUpdateFilesRequest request);
        Task UpdateProfileAsync(int userId, UserUpdateRequest request);
        Task UserUpdateByAdminAsync(int userId, UserUpdateAdminRequest request);
    }
}