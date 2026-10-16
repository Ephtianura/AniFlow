using AniFlow.API.Dto;
using AniFlow.Infrastructure.RedisCache;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AniFlow.Api.Controllers
{
    [ApiController]
    [Authorize(Policy = "AdminPolicy")]
    [Route("api/admin")]
    public class AdminController(IRedisCache redis) : ControllerBase
    {
        private readonly IRedisCache _redis = redis;

        /// <summary> Повністю очищуює кеш аніме. </summary>
        [HttpPost("cache/clear")]
        public async Task<IActionResult> ClearAnimeCache()
        {
            await _redis.RemoveByPrefixAsync("anime");
            return Ok(new ApiResponse("Cache cleared"));
        }


    }
}
