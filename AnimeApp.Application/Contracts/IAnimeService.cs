using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts
{
    public interface IAnimeService
    {
        Task<AnimeResponse> CreateAsync(AnimeCreateRequest request);
        Task DeleteAsync(int id);
        Task<AnimeResponse> GetByIdAsync(int id);
        Task<PagedResult<AnimesResponse>> GetFilteredAsync(AnimeFilter filter);
        Task<List<int>> GetIdsAsync();
        Task<AnimeResponse> GetRandomAsync();
        Task<AnimeResponse> UpdateAsync(int id, AnimeUpdateRequest request);
        Task<AnimeResponse> UpdateFilesAsync(int id, AnimeUpdateFilesRequest request);
    }
}