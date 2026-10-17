using AniFlow.Application.Dto.Requests.Studio;
using AniFlow.Application.Dto.Responses.Studio;
using AniFlow.Core.Filters;
using Microsoft.AspNetCore.Http;

namespace AniFlow.Application.Contracts.App
{
    public interface IStudioService
    {
        Task<StudioResponse> GetByIdAsync(int id);
        Task<PagedResult<StudiosResponse>> GetAllAsync(StudioFilter filter);

        Task<StudioResponse> CreateAsync(CreateStudioRequest request);

        Task UpdateAsync(int id, UpdateStudioRequest request);
        Task UpdateFilesAsync(int id, IFormFile? poster);

        Task DeleteAsync(int id);

    }
}