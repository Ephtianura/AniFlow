using AnimeApp.API.Controllers;
using AnimeApp.API.Filters;
using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Dto.External;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Core.Filters;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/anime")]
    public class AnimeController(IAnimeQueryService animeQueryService) : ControllerBase
    {
        private readonly IAnimeQueryService _animeQueryService = animeQueryService;

        /// <summary> Повертає повну інформацію про аніме по ID. </summary>
        [HttpGet("{id}", Name = "GetAnimeById")]
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

        /// <summary> Повертає аніме за фільтром. </summary>
        [HttpGet]
        [AllowInvalidModelState]
        public async Task<ActionResult<PagedResult<AnimesResponse>>> GetFiltered([FromQuery] AnimeFilter filter)
        {
            filter.Normalize();
            var animes = await _animeQueryService.GetFilteredAsync(filter);
            return Ok(animes);
        }

        /// <summary> Повертає рандомний слуг. </summary>
        [HttpGet("random/slug")]
        public async Task<ActionResult<AnimeSlugResponse>> GetRandomSlug()
        {
            var slug = await _animeQueryService.GetRandomSlugAsync();
            return Ok(slug);
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

       

        /// <summary> Повертає рандомне аніме. Legacy. </summary>
        [HttpGet("random")]
        public async Task<ActionResult<AnimeResponse>> GetRandom()
        {
            var anime = await _animeQueryService.GetRandomAsync();
            return Ok(anime);
        }

    }
}
