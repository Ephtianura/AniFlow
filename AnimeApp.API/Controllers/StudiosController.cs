using AnimeApp.API.Dto;
using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Studio;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using static AnimeApp.Application.Services.StudioService;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudiosController : ControllerBase
    {
        private readonly IStudioService _studioService;
        private readonly IMapper _mapper;
        private readonly IS3FileStorageService _fileUrl;
        public StudiosController(IStudioService studioService, IMapper mapper, IS3FileStorageService fileUrl)
        {
            _studioService = studioService;
            _mapper = mapper;
            _fileUrl = fileUrl;
        }

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


        [HttpPost]
        public async Task<ActionResult<Studio>> Create([FromForm] CreateStudioRequest request)
        {
            var studio = await _studioService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = studio.Id }, studio);
        }


        [HttpPost("batch")]
        public async Task<ActionResult<List<StudioCreationResult>>> CreateMany([FromForm] List<CreateStudioRequest> studios)
        {
            var result = await _studioService.CreateManyWithErrorsAsync(studios);
            return Ok(result);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateStudioRequest request)
        {
            await _studioService.UpdateAsync(id, request);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _studioService.DeleteAsync(id);
            return NoContent();
        }
    }
}
