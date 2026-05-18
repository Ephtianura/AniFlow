using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IAnimeRepository
    {
        Task<Anime?> GetByIdAsync(int id);

        /// <summary> Повертає рандомне аніме </summary>
        Task<Anime?> GetRandomAsync();

        /// <summary> Повертає N кількість рандомних аніме Id </summary>
        Task<List<int>> GetRandomIdsAsync(int count = 100);

        Task<PagedResult<Anime>> GetFilteredAsync(AnimeFilter filter);
        Task AddAsync(Anime anime);
        Task AddRangeAsync(IEnumerable<Anime> animes);
        Task UpdateAsync(Anime anime);
        Task DeleteAsync(Anime anime);
        Task<Anime?> GetByMoonIdAsync(int moonId);
    }
}