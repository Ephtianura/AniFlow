using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IAnimeRepository
    {
        Task AddAsync(Anime anime);
        Task DeleteAsync(Anime anime);
        Task<Anime?> GetByIdAsync(int id);
        Task<Anime?> GetRandomAsync();
        Task<PagedResult<Anime>> GetFilteredAsync(AnimeFilter filter);
        Task UpdateAsync(Anime anime);
    }
}