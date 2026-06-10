using AnimeApp.API.Dto;
using AnimeApp.API.Helpers;
using AnimeApp.Application.Contracts;
using AnimeApp.Application.Contracts.App;
using AnimeApp.Core.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Text.Json;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/")]
    public class StatsController(IAnimeStatsService animeStatsService,
        IStatsService statsService,
        IConnectionMultiplexer redisConnection) : ControllerBase
    {
        private readonly IAnimeStatsService _animeStatsService = animeStatsService;
        private readonly IStatsService _statsService = statsService;
        private readonly IDatabase _redis = redisConnection.GetDatabase();

        private const string PulseCacheKey = "cache:admin:pulse:v2";

        //ещё один статс сервис + кеш
        /// <summary> Перераховує рейтинг для всіх аніме. </summary>
        /// <response code="200">Рейтинги успішно оновлено.</response>
        [Authorize(Policy = "AdminPolicy")]
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
        [Authorize(Policy = "AdminPolicy")]
        [ProducesResponseType(typeof(AdminAnimeStatsDto), StatusCodes.Status200OK)]
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
        [Authorize(Policy = "AdminPolicy")]
        [ProducesResponseType(typeof(UserListsStatsDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUserListsStats()
        {
            var stats = await _animeStatsService.GetUserListsStatsAsync();
            return Ok(stats);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet("pulse")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> GetPulse()
        {
            var cachedData = await _redis.StringGetAsync(PulseCacheKey);
            if (cachedData.HasValue)
            {
                var cachedPulse = JsonSerializer.Deserialize<DashboardPulseDto>(cachedData);
                return Ok(cachedPulse);
            }

            var pulse = await _statsService.GetLivePulseAsync();

            var jsonResponse = JsonSerializer.Serialize(pulse);
            await _redis.StringSetAsync(PulseCacheKey, jsonResponse, TimeSpan.FromSeconds(5));

            return Ok(pulse);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpPost("track-visit")]
        public async Task<IActionResult> TrackVisit()
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");

            string visitorId = UserIdentificationService.GetUniqueVisitorId(HttpContext);

            await _redis.HyperLogLogAddAsync($"metrics:uniques:{today}", visitorId);

            var visitLockKey = $"metrics:visit:lock:{today}:{visitorId}";

            bool isNewSession = await _redis.StringSetAsync(
                visitLockKey,
                "active",
                TimeSpan.FromMinutes(30),
                When.NotExists
            );

            if (isNewSession)
            {
                await _redis.StringIncrementAsync($"metrics:visits:{today}");
            }

            return Ok();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("track-view")]
        public async Task<IActionResult> TrackView([FromBody] TrackViewRequest request)
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            string visitorId = UserIdentificationService.GetUniqueVisitorId(HttpContext);

            var viewLockKey = $"metrics:view:lock:{today}:{visitorId}:{request.AnimeId}:{request.EpisodeNumber}";

            bool isNewView = await _redis.StringSetAsync(
                viewLockKey,
                "watched",
                TimeSpan.FromMinutes(30),
                When.NotExists
            );

            if (isNewView)
            {
                await _redis.StringIncrementAsync($"metrics:views:{today}");

                string memberValue = $"{request.AnimeId}:{request.EpisodeNumber}";
                await _redis.SortedSetIncrementAsync($"metrics:anime:episodes:views:{today}", memberValue, 1);
            }

            return Ok();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [HttpGet("anime/top")]
        public async Task<IActionResult> GetTopAnimeByViewsAsync()
        {
            var end = DateTime.UtcNow;
            var start = end.AddDays(-7);
            var response = await _statsService.GetTopAnimeByViewsAsync(start, end, 10);

            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpPost("metrics/flush")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> FlushDailyGlobalStatsAsync()
        {
            await _statsService.FlushDailyGlobalStatsAsync();
            return Ok();
        }
        [HttpPost("metrics/anime/flush")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> FlushDailyAnimeEpisodeStatsAsync()
        {
            await _statsService.FlushDailyAnimeEpisodeStatsAsync();
            return Ok();
        }


    }
}
