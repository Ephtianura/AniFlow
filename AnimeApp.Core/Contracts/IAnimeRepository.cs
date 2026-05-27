using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IAnimeRepository
    {
        Task<Anime?> GetByIdAsync(int id);

        /// <summary> Повертає рандомне аніме </summary>
        Task<Anime?> GetRandomAsync();

        Task<PagedResult<Anime>> GetFilteredAsync(AnimeFilter filter);
        Task AddAsync(Anime anime);
        Task UpdateAsync(Anime anime);
        Task DeleteAsync(Anime anime);
        Task<Anime?> GetByMoonIdAsync(int moonId);
        Task<Anime?> GetByMalIdAsync(int malId);
        Task<List<int>> GetAllMixedIdsAsync();
        Task<string> GetRandomSlugAsync();
    }
}