using AniFlow.Core.Filters;
using AniFlow.Core.Models;

namespace AniFlow.Core.Contracts
{
    public interface IStudioRepository
    {
        Task AddAsync(Studio studio);
        Task AddRangeAsync(IEnumerable<Studio> studios);
        Task DeleteAsync(Studio studio);
        Task<Studio?> GetWithAnimesByIdAsync(int id);
        Task<PagedResult<Studio>> GetFilteredAsync(StudioFilter filter);
        Task UpdateAsync(Studio studio);
        Task<Studio?> GetByNameAsync(string name);
        Task<Studio?> GetByIdAsync(int id);
    }
}