using AnimeApp.API.Dto;
using AnimeApp.Application.Contracts.App;
using AnimeApp.Core.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/")]
    public class StatsController(IAnimeStatsService animeStatsService) : ControllerBase
    {
        private readonly IAnimeStatsService _animeStatsService = animeStatsService;

        /// <summary> Перераховує рейтинг для всіх аніме. </summary>
       /// <response code="200">Рейтинги успішно оновлено.</response>
        [HttpPost("anime/recalculate-ratings")]
        public async Task<IActionResult> RecalculateRatings()
        {
            await _animeStatsService.RecalculateAnimeStats();
            return Ok(new ApiResponse("Anime ratings successfully recalculated"));
        }

        /// <summary>
        /// Отримує агреговану статистику по аніме для адмін-панелі.
        /// </summary>
        /// <remarks>
        /// Повертає готові дані, згруповані за роками, сезонами, жанрами, статусами, типами, студіями та епізодами.
        /// </remarks>
        /// <returns>Об'єкт з даними для графіків дашборду.</returns>
        /// <response code="200">Статистику успішно згенеровано та завантажено.</response>
        /// <response code="500">Помилка на сервері при обробці або агрегації даних.</response>
        [HttpGet("stats/anime-dashboard")]
        [ProducesResponseType(typeof(AdminDashboardStatsDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetDashboardAnimeStats()
        {
            var stats = await _animeStatsService.GetDashboardAnimeStats();
            return Ok(stats);
        }

        /// <summary>
        /// Отримує загальну статистику по списках користувачів (кількість аніме в статусах, улюблених та оцінених).
        /// </summary>
        /// <remarks>
        /// Рахує кількість записів для кожного типу списку (Planned, Watching, Completed тощо), а також загальну кількість фаворитів.
        /// </remarks>
        /// <returns>Об'єкт зі статистикою користувацьких списків.</returns>
        /// <response code="200">Статистику списків успішно отримано.</response>
        /// <response code="500">Помилка на сервері при підрахунку статистики.</response>
        [HttpGet("stats/user-lists")]
        [ProducesResponseType(typeof(UserListsStatsDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUserListsStats()
        {
            var stats = await _animeStatsService.GetUserListsStatsAsync();
            return Ok(stats);
        }

    }
}
