using AniFlow.Application.Dto.Requests.User;
using AniFlow.Application.Dto.Responses.User;
using AniFlow.Core.Filters;
using AniFlow.Core.Models;

namespace AniFlow.Application.Contracts.App
{
    public interface IUserService
    {
        Task DeleteAsync(int userId);
        Task<UserMeResponse> GetByIdAsync(int userId);
        Task<PagedResult<User>> GetFilteredAsync(UserFilter filter);
        Task<User> GetUserByIdAsync(int userId);
        Task<UserUpdateFilesResponse> UpdateFilesAsync(int id, UserUpdateFilesRequest request);
        Task UpdateProfileAsync(int userId, UserUpdateRequest request);
        Task UserUpdateByAdminAsync(int userId, UserUpdateAdminRequest request);
        Task<UserMeResponse> GetMeAsync(int userId);
    }
}