using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IAnimeRepository
    {
        Task<Anime?> GetByIdAsync(int id);
        Task<Anime?> GetFullByIdAsync(int id);
        Task<PagedResult<Anime>> GetFilteredAsync(AnimeFilter filter);

        /// <summary> Повертає рандомне аніме </summary>
        Task<Anime?> GetRandomAsync();
        Task<string> GetRandomSlugAsync();
        Task<List<int>> GetAllMixedIdsAsync();

        Task AddAsync(Anime anime);
        Task UpdateAsync(Anime anime);
        Task DeleteAsync(Anime anime);

        Task<Anime?> GetByMoonIdAsync(int moonId);
        Task<Anime?> GetByMalIdAsync(int malId);
        Task<Anime?> GetWithGenresStudioByIdAsync(int id);
        Task<Anime?> GetWithRelateds(int relatedId);
    }
}