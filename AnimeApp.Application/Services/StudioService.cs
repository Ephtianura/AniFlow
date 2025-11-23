using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Studio;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using Microsoft.AspNetCore.Http;
using System.Xml.Linq;

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

            var studio = Studio.Create(request.Name, request.Description);

            await _studios.AddAsync(studio);
            return studio;
        }

        public async Task<Studio> UpdateFilesAsync(int id, IFormFile? poster)
        {
            var studio = await GetStudioByIdAsync(id);

            // ===================== Файли =====================
            if (poster != null)
            {
                using var stream = poster.OpenReadStream();
                var posterFileName = await _fileStorage.UploadFileAsync(stream, poster.FileName, "studio-posters");
                studio.ChangePoster(posterFileName);
            }
            if (poster == null)
                throw new ArgumentException("At least 1 poster or 1 screenshot must be uploaded.");

            await _studios.UpdateAsync(studio);
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


                    var studio = Studio.Create(g.Name, g.Description);

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
