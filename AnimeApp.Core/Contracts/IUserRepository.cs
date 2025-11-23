using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IUserRepository
    {
        Task AddAsync(User user);
        Task DeleteAsync(User user);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task<PagedResult<User>> GetFilteredAsync(UserFilter filter);
        Task<User?> GetWithAnimeListAsync(int userId);
        Task UpdateAsync(User user);
    }
}