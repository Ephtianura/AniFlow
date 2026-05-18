using AnimeApp.API.Controllers;
using AnimeApp.API.Dto;
using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Dto.External;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Core.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/anime")]
    public class AnimeController(
        IAnimeQueryService animeQueryService,
        IAnimeCommandService animeCommandService,
        IAnimeStatsService animeStatsService) : ControllerBase
    {
        private readonly IAnimeQueryService _animeQueryService = animeQueryService;
        private readonly IAnimeCommandService _animeCommandService = animeCommandService;
        private readonly IAnimeStatsService _animeStatsService = animeStatsService;

        /// <summary> Повертає повну інформацію про аніме по ID. </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<AnimeResponse>> GetById(int id)
        {
            var anime = await _animeQueryService.GetByIdAsync(id);
            return Ok(anime);
        }

        /// <summary> Повертає повну інформацію про аніме по slug. </summary>
        /// <remarks> Приклад запиту: <i>kusuriya-no-hitorigoto-2nd-season-1</i> </remarks>
        /// <exception cref="ArgumentException"></exception>
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<AnimeUserResponse>> GetBySlug(string slug)
        {
            var id = Helper.ExtractId(slug) ?? throw new ArgumentException("Invalid slug");
            var anime = await _animeQueryService.GetByIdAsync(id);
            return Ok(anime);
        }

        /// <summary> Повертає рандомне аніме. </summary>
        [HttpGet("random")]
        public async Task<ActionResult<AnimeResponse>> GetRandom()
        {
            var anime = await _animeQueryService.GetRandomAsync();
            return Ok(anime);
        }

        /// <summary>
        /// Повертає згруповані епізоди аніме за відеоплеєрами та озвучкам.
        /// Кожен плеєра містить доступні озвучки та список епізодів для кожної озвучки.
        /// </summary>
        /// <param name="malId"> Ідентифікатор аніме в MyAnimeList. </param>
        /// <returns> Колекцію плеєрів з вкладеною структурою озвучок та епізодів. </returns>
        /// <remarks> 
        ///     <para>MyAnimeListId = ShikimoriId</para>
        ///     <para>Приклад запиту: <b>52034</b></para>
        /// </remarks>
        [HttpGet("episodes/{malId}")]
        public async Task<ActionResult<PlayerEpisodeSet>> GetEpisodes(int malId)
        {
            var episodes = await _animeQueryService.GetEpisodes(malId);
            return Ok(episodes);
        }

        /// <summary> Повертає аніме за фільтром. </summary>
        [HttpGet]
        public async Task<ActionResult<PagedResult<AnimesResponse>>> GetFiltered([FromQuery] AnimeFilter filter)
        {
            var animes = await _animeQueryService.GetFilteredAsync(filter);
            return Ok(animes);
        }



        // ==================== Адмін права ====================

        /// <summary> Створює нове аніме. </summary>
        [HttpPost]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<AnimeCreateResponse>> Create([FromBody] AnimeCreateRequest request)
        {
            var response = await _animeCommandService.CreateAsync(request);
            return CreatedAtAction(
                nameof(GetById),
                new { id = response.Id },
                response
            );
        }

        /// <summary> Оновлює текстову інформацію про аніме. </summary>
        [HttpPatch("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult> Update(int id, [FromBody] AnimeUpdateRequest request)
        {
            await _animeCommandService.UpdateAsync(id, request);
            return Ok(new ApiResponse("Anime succesfully updated"));
        }

        /// <summary> Завантажує/оновлює файли (постер, скріншоти) через multipart/form-data. </summary>
        [HttpPatch("{id}/files")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult> UpdateFiles(int id, [FromForm] AnimeUpdateFilesRequest request)
        {
            await _animeCommandService.UpdateFilesAsync(id, request);
            return Ok(new ApiResponse("Anime files succesfully updated"));
        }

        /// <summary> Повністю видаляє аніме. </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> Delete(int id)
        {
            await _animeCommandService.DeleteAsync(id);
            return NoContent();
        }

        /// <summary> Перераховує рейтинг для всіх аніме. </summary>
        [HttpPost("recalculate-ratings")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> RecalculateRatings()
        {
            await _animeStatsService.RecalculateAnimeStats();
            return Ok(new ApiResponse("Anime ratings successfully recalculated"));
        }
    }
}
