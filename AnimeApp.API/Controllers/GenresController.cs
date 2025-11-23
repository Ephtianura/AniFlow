using AnimeApp.Application.Contracts;
using AnimeApp.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static AnimeApp.Application.Services.GenreService;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenresController : ControllerBase
    {
        private readonly IGenreService _genreService;

        public GenresController(IGenreService genreService) => _genreService = genreService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Genre>>> GetAll()
        {
            var genres = await _genreService.GetAllAsync();
            return Ok(genres);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Genre>> GetById(int id)
        {
            var genre = await _genreService.GetByIdAsync(id);
            if (genre == null) return NotFound();
            return Ok(genre);
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpPost]
        public async Task<ActionResult<Genre>> Create([FromBody] CreateGenreRequest request)
        {
            var genre = await _genreService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = genre.Id }, genre);
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpPost("batch")]
        public async Task<ActionResult<IEnumerable<Genre>>> CreateMany([FromBody] IEnumerable<CreateGenreRequest> requests)
        {
            var genres = await _genreService.CreateManyAsync(requests);
            return Ok(genres);
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateGenreRequest request)
        {
            await _genreService.UpdateAsync(id, request);
            return NoContent();
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _genreService.DeleteAsync(id);
            return NoContent();
        }
    }
}
