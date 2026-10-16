using AniFlow.Core.Dto;
using AniFlow.Core.Filters;
using AniFlow.Core.Models;

namespace AniFlow.Core.Contracts
{
    public interface IUserRepository
    {
        Task AddAsync(User user);
        Task DeleteAsync(User user);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task<PagedResult<User>> GetFilteredAsync(UserFilter filter);
        Task UpdateAsync(User user);
        Task<bool> ExistsAsync(int userId);
        Task<UserMeRawResponse?> GetMeAsync(int userId);
    }
}