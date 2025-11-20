using AnimeApp.Application.Services;
using AnimeApp.Application.Dto.Studio;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using static AnimeApp.Application.Services.StudioService;

namespace AnimeApp.Application.Contracts
{
    public interface IStudioService
    {
        Task<Studio> CreateAsync(CreateStudioRequest request);
        Task<List<StudioCreationResult>> CreateManyWithErrorsAsync(IEnumerable<CreateStudioRequest> studiosData);
        Task DeleteAsync(int id);
        Task<PagedResult<Studio>> GetAllAsync(StudioFilter filter);
        Task<Studio?> GetByIdAsync(int id);
        Task UpdateAsync(int id, UpdateStudioRequest request);
    }
}