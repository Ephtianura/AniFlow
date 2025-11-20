using AnimeApp.Application.Dto.Anime;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts
{
    public interface IAnimeService
    {
        Task<Anime> CreateAsync(AnimeCreateRequest request);
        Task DeleteAsync(int id);
        Task<Anime> GetByIdAsync(int id);
        Task<PagedResult<Anime>> GetFilteredAsync(AnimeFilter filter);
        Task<Anime> GetRandomAsync();
        Task<Anime> UpdateAsync(int id, AnimeUpdateRequest request);
        Task<Anime> UpdateFilesAsync(int id, AnimeUpdateFilesRequest request);
    }
}