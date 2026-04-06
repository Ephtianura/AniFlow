using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Core.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AnimeApp.API.Dto;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnimesController(IAnimeService animeService, IAnimeStatsService animeStatsService) : ControllerBase
    {
        private readonly IAnimeService _animeService = animeService;
        private readonly IAnimeStatsService _animeStatsService = animeStatsService;

        /// <summary>
        /// Повертає повну інформацію про аніме по айді
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<AnimeResponse>> GetById(int id)
        {
            var anime = await _animeService.GetByIdAsync(id);
            return Ok(anime);
        }

        /// <summary>
        /// Повертає рандомне аніме
        /// </summary>
        [HttpGet("random")]
        public async Task<ActionResult<AnimeResponse>> GetRandom()
        {
            var anime = await _animeService.GetRandomAsync();
            return Ok(anime);
        }

        /// <summary>
        /// Повертає аніме за фільтром
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<PagedResult<AnimesResponse>>> GetFiltered([FromQuery] AnimeFilter filter)
        {
            var animes = await _animeService.GetFilteredAsync(filter);
            return Ok(animes);
        }

        // ==================== Адмін права ====================

        /// <summary>
        /// Створює аніме
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<AnimeResponse>> Create([FromBody] AnimeCreateRequest request)
        {
            var anime = await _animeService.CreateAsync(request);

            return CreatedAtAction(nameof(GetById), new { id = anime.Id }, anime);
        }

        /// <summary>
        /// Оновлює текстову інформацію про аніме через FromBody
        /// </summary>
        [HttpPatch("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<AnimeResponse>> Update(int id, [FromBody] AnimeUpdateRequest request)
        {
            var anime = await _animeService.UpdateAsync(id, request);
            return Ok(anime);
        }

        /// <summary>
        /// Окремий метод FromForm, щоб завантажити/оновити файли (постер, скріншоти)
        /// </summary>
        [HttpPatch("{id}/files")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<AnimeResponse>> UpdateFiles(int id, [FromForm] AnimeUpdateFilesRequest request)
        {
            var anime = await _animeService.UpdateFilesAsync(id, request);
            return Ok(anime);
        }

        /// <summary>
        /// Повністю видаляє аніме
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> Delete(int id)
        {
            await _animeService.DeleteAsync(id);
            return NoContent();
        }

        /// <summary>
        /// Перераховує рейтинг для всіх аніме
        /// </summary>
        [HttpPost("recalculate-ratings")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> RecalculateRatings()
        {
            await _animeStatsService.RecalculateAnimeStats();
            return Ok(new ApiResponse("Anime ratings successfully recalculated"));
        }
    }
}
