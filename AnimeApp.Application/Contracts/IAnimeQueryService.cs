using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Core.Filters;

namespace AnimeApp.Application.Contracts
{
    public interface IAnimeQueryService
    {
        Task<AnimeResponse> GetByIdAsync(int id);
        Task<PagedResult<AnimesResponse>> GetFilteredAsync(AnimeFilter filter);
        Task<AnimeResponse> GetRandomAsync();
        Task<List<int>> GetIdsAsync();
    }

    public interface IAnimeCommandService
    {
        Task<AnimeResponse> CreateAsync(AnimeCreateRequest request);
        Task<AnimeResponse> UpdateAsync(int id, AnimeUpdateRequest request);
        Task<AnimeResponse> UpdateFilesAsync(int id, AnimeUpdateFilesRequest request);
        Task DeleteAsync(int id);
    }
}