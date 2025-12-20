using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IAnimeRepository
    {
        Task AddAsync(Anime anime);
        Task AddRangeAsync(IEnumerable<Anime> animes);
        Task DeleteAsync(Anime anime);
        Task<List<int>> GetAllIdsAsync(int count = 100);
        Task<Anime?> GetByIdAsync(int id);
        Task<PagedResult<Anime>> GetFilteredAsync(AnimeFilter filter);
        Task<Anime?> GetRandomAsync();
        Task UpdateAsync(Anime anime);
    }
}