using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IStudioRepository
    {
        Task AddAsync(Studio studio);
        Task AddRangeAsync(IEnumerable<Studio> studios);
        Task DeleteAsync(Studio studio);
        Task<Studio?> GetByIdAsync(int id);
        Task<PagedResult<Studio>> GetFilteredAsync(StudioFilter filter);
        Task UpdateAsync(Studio studio);
    }
}