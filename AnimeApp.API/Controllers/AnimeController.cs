using AnimeApp.API.Dto;
using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Anime;
using AnimeApp.Core.Filters;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnimesController(IAnimeService animeService, IMapper mapper, IS3FileStorageService fileUrl) : ControllerBase
    {
        private readonly IAnimeService _animeService = animeService;
        private readonly IMapper _mapper = mapper;
        private readonly IS3FileStorageService _fileUrl = fileUrl;

        [HttpGet("{id}")]
        public async Task<ActionResult<AnimeResponse>> GetById(int id)
        {
            var anime = await _animeService.GetByIdAsync(id);

            var response = _mapper.Map<AnimeResponse>(anime);

            if (!string.IsNullOrWhiteSpace(anime.PosterFileName))
                response.PosterUrl = _fileUrl.GetUrl(anime.PosterFileName);

            if (anime.ScreenshotsFileName != null && anime.ScreenshotsFileName.Any())
            {
                response.ScreenshotsUrls = anime.ScreenshotsFileName
                    .Select(f => _fileUrl.GetUrl(f))
                    .ToList();
            }
            if (response.Relateds != null)
            {
                foreach (var related in response.Relateds)
                {
                    var relatedAnime = anime.Relateds.FirstOrDefault(r => r.RelatedAnime.Id == related.Id)?.RelatedAnime;
                    if (relatedAnime != null && !string.IsNullOrWhiteSpace(relatedAnime.PosterFileName))
                        related.PosterUrl = _fileUrl.GetUrl(relatedAnime.PosterFileName);
                }
            }

            return Ok(response);
        }

        [HttpGet("random")]
        public async Task<ActionResult<AnimeResponse>> GetRandom()
        {
            var anime = await _animeService.GetRandomAsync();
            var response = _mapper.Map<AnimeResponse>(anime);

            if (!string.IsNullOrWhiteSpace(anime.PosterFileName))
                response.PosterUrl = _fileUrl.GetUrl(anime.PosterFileName);

            if (anime.ScreenshotsFileName != null && anime.ScreenshotsFileName.Any())
            {
                response.ScreenshotsUrls = anime.ScreenshotsFileName
                    .Select(f => _fileUrl.GetUrl(f))
                    .ToList();
            }

            return Ok(response);
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<AnimesResponse>>> GetFiltered([FromQuery] AnimeFilter filter)
        {
            var pagedResult = await _animeService.GetFilteredAsync(filter);

            var mappedItems = pagedResult.Items.Select(anime =>
            {
                var animeDto = _mapper.Map<AnimesResponse>(anime);

                if (!string.IsNullOrWhiteSpace(anime.PosterFileName))
                    animeDto = animeDto with { PosterUrl = _fileUrl.GetUrl(anime.PosterFileName) };

                return animeDto;
            }).ToList();

            var response = new PagedResult<AnimesResponse>(
                items: mappedItems,
                totalCount: pagedResult.TotalCount,
                page: pagedResult.Page,
                pageSize: pagedResult.PageSize
            );

            return Ok(response);
        }

        [HttpPost]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<AnimeResponse>> Create([FromBody] AnimeCreateRequest request)
        {
            var anime = await _animeService.CreateAsync(request);

            var response = _mapper.Map<AnimeResponse>(anime);

            if (!string.IsNullOrWhiteSpace(anime.PosterFileName))
                response.PosterUrl = _fileUrl.GetUrl(anime.PosterFileName);

            if (anime.ScreenshotsFileName != null && anime.ScreenshotsFileName.Any())
            {
                response.ScreenshotsUrls = anime.ScreenshotsFileName
                    .Select(f => _fileUrl.GetUrl(f))
                    .ToList();
            }

            return CreatedAtAction(nameof(GetById), new { id = anime.Id }, response);
        }

        [HttpPut("{id}/UploadFiles")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<AnimeResponse>> UploadFiles(int id, [FromForm] AnimeUpdateFilesRequest request)
        {
            var anime = await _animeService.UpdateFilesAsync(id, request);

            var response = _mapper.Map<AnimeResponse>(anime);

            if (!string.IsNullOrWhiteSpace(anime.PosterFileName))
                response.PosterUrl = _fileUrl.GetUrl(anime.PosterFileName);

            if (anime.ScreenshotsFileName != null && anime.ScreenshotsFileName.Any())
            {
                response.ScreenshotsUrls = anime.ScreenshotsFileName
                    .Select(f => _fileUrl.GetUrl(f))
                    .ToList();
            }

            return Ok(response);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<AnimeResponse>> Update(int id, [FromBody] AnimeUpdateRequest request)
        {
            var anime = await _animeService.UpdateAsync(id, request);

            var response = _mapper.Map<AnimeResponse>(anime);

            if (!string.IsNullOrWhiteSpace(anime.PosterFileName))
                response.PosterUrl = _fileUrl.GetUrl(anime.PosterFileName);

            if (anime.ScreenshotsFileName != null && anime.ScreenshotsFileName.Any())
            {
                response.ScreenshotsUrls = anime.ScreenshotsFileName
                    .Select(f => _fileUrl.GetUrl(f))
                    .ToList();
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> Delete(int id)
        {
            await _animeService.DeleteAsync(id);
            return NoContent();
        }
    }
}
