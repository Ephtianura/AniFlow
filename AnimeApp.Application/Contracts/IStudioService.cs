using AnimeApp.Application.Dto.Requests.Studio;
using AnimeApp.Application.Dto.Responses.Studio;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using Microsoft.AspNetCore.Http;

namespace AnimeApp.Application.Contracts
{
    public interface IStudioService
    {
        Task<Studio?> GetByIdAsync(int id);
        Task<PagedResult<Studio>> GetAllAsync(StudioFilter filter);

        Task<Studio> CreateAsync(CreateStudioRequest request);
        Task<List<StudioCreationResult>> CreateManyWithErrorsAsync(IEnumerable<CreateStudioRequest> studiosData);

        Task UpdateAsync(int id, UpdateStudioRequest request);
        Task<Studio> UpdateFilesAsync(int id, IFormFile? poster);

        Task DeleteAsync(int id);

    }
}