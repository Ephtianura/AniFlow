using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.Studio;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AnimeApp.Application.Dto.Responses.Studio;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudiosController(IStudioService studioService, IMapper mapper, IS3FileStorageService fileUrl) : ControllerBase
    {
        private readonly IStudioService _studioService = studioService;
        private readonly IMapper _mapper = mapper;
        private readonly IS3FileStorageService _fileUrl = fileUrl;

        /// <summary>
        /// Повертає інформацію про студію за ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var studio = await _studioService.GetByIdAsync(id);

            var response = _mapper.Map<StudioResponse>(studio);

            if (!string.IsNullOrWhiteSpace(studio.PosterFileName))
                response = response with
                {
                    PosterUrl = _fileUrl.GetUrl(studio.PosterFileName)
                };

            var animes = studio.Animes.Select(anime =>
            {
                var mapped = _mapper.Map<AnimesResponse>(anime);

                return !string.IsNullOrWhiteSpace(anime.PosterFileName)
                    ? mapped with { PosterUrl = _fileUrl.GetUrl(anime.PosterFileName) }
                    : mapped;

            }).ToList();

            response = response with
            {
                Animes = animes
            };

            return Ok(response);
        }

        /// <summary>
        /// Повертає студію за фільтром
        /// </summary>
        [HttpGet]
        public async Task<ActionResult> GetFiltered([FromQuery] StudioFilter filter)
        {
            var pagedStudios = await _studioService.GetAllAsync(filter);

            var mappedItems = pagedStudios.Items.Select(studio =>
            {
                var studioDto = _mapper.Map<StudioResponse>(studio);

                if (!string.IsNullOrWhiteSpace(studio.PosterFileName))
                    studioDto = studioDto with { PosterUrl = _fileUrl.GetUrl(studio.PosterFileName) };

                var animes = studio.Animes.Select(anime =>
                {
                    var animeDto = _mapper.Map<AnimesResponse>(anime);
                    return !string.IsNullOrWhiteSpace(anime.PosterFileName)
                        ? animeDto with { PosterUrl = _fileUrl.GetUrl(anime.PosterFileName) }
                        : animeDto;
                }).ToList();

                studioDto = studioDto with { Animes = animes };

                return studioDto;
            }).ToList();

            var response = new PagedResult<StudioResponse>(
                items: mappedItems,
                totalCount: pagedStudios.TotalCount,
                page: pagedStudios.Page,
                pageSize: pagedStudios.PageSize
            );

            return Ok(response);
        }

        // ==================== Адмін права ====================

        /// <summary>
        /// Створює нову студію
        /// </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost]
        public async Task<ActionResult<Studio>> Create([FromBody] CreateStudioRequest request)
        {
            var studio = await _studioService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = studio.Id }, studio);
        }

        /// <summary>
        /// Завантажує постер для студії через form-data
        /// </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpPatch("{id}/files")]
        public async Task<ActionResult<Studio>> UploadFiles(int id, IFormFile? Poster)
        {
            await _studioService.UpdateFilesAsync(id, Poster);
            return NoContent();
        }

        /// <summary>
        /// Оновлює інформацію про студію
        /// </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateStudioRequest request)
        {
            await _studioService.UpdateAsync(id, request);
            return NoContent();
        }

        /// <summary>
        /// Створює багато студій
        /// </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost("batch")]
        public async Task<ActionResult<List<StudioCreationResult>>> CreateMany([FromBody] List<CreateStudioRequest> studios)
        {
            var result = await _studioService.CreateManyWithErrorsAsync(studios);
            return Ok(result);
        }

        /// <summary>
        /// Видаляє студію
        /// </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _studioService.DeleteAsync(id);
            return NoContent();
        }
    }
}
