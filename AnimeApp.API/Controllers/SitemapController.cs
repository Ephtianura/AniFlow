using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Dto.Responses.Anime;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/sitemap")]
    public class SitemapController(ISitemapService sitemapService) : ControllerBase
    {
        private readonly ISitemapService _sitemapService = sitemapService;

        [HttpGet("anime")]
        [ResponseCache(Duration = 86400, Location = ResponseCacheLocation.Any)]
        public async Task<ActionResult<AnimeUserResponse>> GetAllAnime()
        {
            var anime = await _sitemapService.GetAllAnime();
            return Ok(anime);
        }


    }
}
