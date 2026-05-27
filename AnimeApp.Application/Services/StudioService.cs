using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.Requests.Studio;
using AnimeApp.Application.Dto.Responses.Studio;
using AnimeApp.Application.Exceptions;
using AnimeApp.Application.Helpers;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;

namespace AnimeApp.Application.Services
{
    public class StudioService(IStudioRepository studios, IS3FileStorageService fileStorage, IMapper mapper) : IStudioService
    {
        private readonly IStudioRepository _studiosRep = studios;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly IMapper _mapper = mapper;

        public async Task<StudioResponse> GetByIdAsync(int id)
        {
            Studio studio = await GetStudioByIdAsync(id);
            var response = _mapper.Map<StudioResponse>(studio);

            if (!string.IsNullOrWhiteSpace(studio.PosterFileName))
                response.PosterUrl = _fileStorage.GetUrl(studio.PosterFileName);

            response.Animes = response.Animes
               .ConvertAll(a =>
               {
                   if (!string.IsNullOrWhiteSpace(a.PosterUrl))
                       a.PosterUrl = _fileStorage.GetUrl(a.PosterUrl);

                   return a;
               });
            return response;
        }

        public async Task<PagedResult<StudiosResponse>> GetAllAsync(StudioFilter filter)
        {
            var studios = await _studiosRep.GetFilteredAsync(filter);

            var mappedStudios = studios.Items.Select(s => new StudiosResponse()
            {
                Id = s.Id,
                MalId = s.MalId,
                Slug = s.Slug,
                Name = s.Name,
                Description = s.Description,
                PosterUrl = string.IsNullOrWhiteSpace(s.PosterFileName) ? null
                    : _fileStorage.GetUrl(s.PosterFileName),
            }
            ).ToList();

            return new PagedResult<StudiosResponse>(
                items: mappedStudios,
                totalCount: studios.TotalCount,
                page: studios.Page,
                pageSize: studios.PageSize
            );
        }

        public async Task<StudioResponse> CreateAsync(CreateStudioRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentNullException("Studio name cannot be empty");

            var studio = Studio.Create(name: request.Name, slug: "unknown", description: request.Description);
            await _studiosRep.AddAsync(studio);

            studio.ChangeSlug(AniBuilder.GenerateSlug(studio.Name, studio.Id));
            await _studiosRep.UpdateAsync(studio);

            var response = _mapper.Map<StudioResponse>(studio);

            if (!string.IsNullOrWhiteSpace(studio.PosterFileName))
                response.PosterUrl = _fileStorage.GetUrl(studio.PosterFileName);

            return response;
        }

        public async Task UpdateFilesAsync(int id, IFormFile? poster)
        {
            var studio = await GetStudioByIdAsync(id);

            // ===================== Файли =====================
            if (poster != null)
            {
                using var stream = poster.OpenReadStream();
                var posterFileName = await _fileStorage.UploadFileAsync(stream, poster.FileName, StoragePaths.StudioPosters);
                studio.ChangePoster(posterFileName);
            }
            if (poster == null)
                throw new ArgumentException("At least 1 poster or 1 screenshot must be uploaded.");

            await _studiosRep.UpdateAsync(studio);
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

            await _studiosRep.UpdateAsync(studio);
        }

        public async Task DeleteAsync(int id)
        {
            var studio = await GetStudioByIdAsync(id);
            await _studiosRep.DeleteAsync(studio);
        }

        private async Task<Studio> GetStudioByIdAsync(int id) =>
            await _studiosRep.GetByIdAsync(id) ?? throw new NotFoundException("Studio", id);
    }
}
