using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Studio;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AnimeApp.DataAccess.Repositories;

namespace AnimeApp.Application.Services
{
    public partial class StudioService : IStudioService
    {
        private readonly IStudioRepository _studios;
        private readonly IS3FileStorageService _fileStorage;

        public StudioService(IStudioRepository studios, IS3FileStorageService fileStorage)
        {
            _studios = studios;
            _fileStorage = fileStorage;
        }

        public async Task<Studio?> GetByIdAsync(int id) =>
            await GetStudioByIdAsync(id);

        public async Task<PagedResult<Studio>> GetAllAsync(StudioFilter filter) =>
            await _studios.GetFilteredAsync(filter);

        public async Task<Studio> CreateAsync(CreateStudioRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentNullException("Studio name cannot be empty");

            string? posterFileName = null;
            if (request.Poster != null)
            {
                using var stream = request.Poster.OpenReadStream();
                posterFileName = await _fileStorage.UploadFileAsync(stream, request.Poster.FileName, "studio-posters");
            }

            var studio = Studio.Create(request.Name, request.Description, posterFileName);

            await _studios.AddAsync(studio);
            return studio;
        }

        public async Task<List<StudioCreationResult>> CreateManyWithErrorsAsync(IEnumerable<CreateStudioRequest> studiosData)
        {
            var tasks = studiosData.Select(async g =>
            {
                var result = new StudioCreationResult { Request = g };
                try
                {
                    if (string.IsNullOrWhiteSpace(g.Name))
                        throw new ArgumentException("Studio name cannot be empty");

                    string? posterFileName = null;
                    if (g.Poster != null)
                    {
                        using var stream = g.Poster.OpenReadStream();
                        posterFileName = await _fileStorage.UploadFileAsync(stream, g.Poster.FileName, "studio-posters");
                    }

                    var studio = Studio.Create(g.Name, g.Description, posterFileName);

                    await _studios.AddAsync(studio);

                    result.Studio = studio;
                }
                catch (Exception ex)
                {
                    result.Error = ex.Message;
                }

                return result;
            });

            var results = await Task.WhenAll(tasks);

            return results.ToList();
        }

        public class StudioCreationResult
        {
            public Studio? Studio { get; set; }
            public CreateStudioRequest? Request { get; set; }
            public string? Error { get; set; }
        }


        public async Task UpdateAsync(int id, UpdateStudioRequest request)
        {
            var studio = await GetStudioByIdAsync(id);

            if (request.Name != null)
            {
                if (!string.IsNullOrWhiteSpace(request.Name))
                    studio.ChangeName(request.Name);
                else
                    throw new ArgumentException("Studio name cannot be empty");
            }

            if (request.Poster != null)
            {
                string? posterFileName = null;
                using var stream = request.Poster.OpenReadStream();
                posterFileName = await _fileStorage.UploadFileAsync(stream, request.Poster.FileName, "studio-posters");
                studio.ChangePoster(posterFileName);
            }

            if (request.Description != null)
                studio.ChangeDescription(request.Description);

            await _studios.UpdateAsync(studio);
        }

        public async Task DeleteAsync(int id)
        {
            var studio = await GetStudioByIdAsync(id);
            await _studios.DeleteAsync(studio);
        }

        private async Task<Studio> GetStudioByIdAsync(int id)
        {
            var studio = await _studios.GetByIdAsync(id);
            if (studio is null)
                throw new EntityNotFoundException("Studio", id);
            return studio;
        }
    }
}
