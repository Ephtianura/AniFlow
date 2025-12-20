using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Core.Filters;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnimesController(IAnimeService animeService) : ControllerBase
    {
        private readonly IAnimeService _animeService = animeService;

        [HttpGet("{id}")]
        public async Task<ActionResult<AnimeResponse>> GetById(int id)
        {
            var anime = await _animeService.GetByIdAsync(id);

            return Ok(anime);
        }

        [HttpGet("random")]
        public async Task<ActionResult<AnimeResponse>> GetRandom()
        {
            var anime = await _animeService.GetRandomAsync();
            return Ok(anime);
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<AnimesResponse>>> GetFiltered([FromQuery] AnimeFilter filter)
        {
            var response = await _animeService.GetFilteredAsync(filter);

            return Ok(response);
        }

        [HttpPost]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<AnimeResponse>> Create([FromBody] AnimeCreateRequest request)
        {
            var anime = await _animeService.CreateAsync(request);

            //var response = _mapper.Map<AnimeResponse>(anime);

            //if (!string.IsNullOrWhiteSpace(anime.PosterFileName))
            //    response.PosterUrl = _fileUrl.GetUrl(anime.PosterFileName);

            //if (anime.ScreenshotsFileName != null && anime.ScreenshotsFileName.Any())
            //{
            //    response.ScreenshotsUrls = anime.ScreenshotsFileName
            //        .Select(f => _fileUrl.GetUrl(f))
            //        .ToList();
            //}

            return CreatedAtAction(nameof(GetById), new { id = anime.Id }, anime);
        }

        //[HttpPut("{id}/UploadFiles")]
        //[Authorize(Policy = "AdminPolicy")]
        //public async Task<ActionResult<AnimeResponse>> UploadFiles(int id, [FromForm] AnimeUpdateFilesRequest request)
        //{
        //    var anime = await _animeService.UpdateFilesAsync(id, request);

        //    //var response = _mapper.Map<AnimeResponse>(anime);

        //    //if (!string.IsNullOrWhiteSpace(anime.PosterFileName))
        //    //    response.PosterUrl = _fileUrl.GetUrl(anime.PosterFileName);

        //    //if (anime.ScreenshotsFileName != null && anime.ScreenshotsFileName.Any())
        //    //{
        //    //    response.ScreenshotsUrls = anime.ScreenshotsFileName
        //    //        .Select(f => _fileUrl.GetUrl(f))
        //    //        .ToList();
        //    //}

        //    return Ok(anime);
        //}

        //[HttpPut("{id}")]
        //[Authorize(Policy = "AdminPolicy")]
        //public async Task<ActionResult<AnimeResponse>> Update(int id, [FromBody] AnimeUpdateRequest request)
        //{
        //    var anime = await _animeService.UpdateAsync(id, request);

        //    var response = _mapper.Map<AnimeResponse>(anime);

        //    if (!string.IsNullOrWhiteSpace(anime.PosterFileName))
        //        response.PosterUrl = _fileUrl.GetUrl(anime.PosterFileName);

        //    if (anime.ScreenshotsFileName != null && anime.ScreenshotsFileName.Any())
        //    {
        //        response.ScreenshotsUrls = anime.ScreenshotsFileName
        //            .Select(f => _fileUrl.GetUrl(f))
        //            .ToList();
        //    }

        //    return Ok(response);
        //}

        //[HttpDelete("{id}")]
        //[Authorize(Policy = "AdminPolicy")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    await _animeService.DeleteAsync(id);
        //    return NoContent();
        //}
    }
}
