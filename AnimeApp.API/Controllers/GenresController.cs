using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.Genre;
using AnimeApp.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenresController(IGenreService genreService) : ControllerBase
    {
        private readonly IGenreService _genreService = genreService;

        /// <summary>
        /// Повертає всі жанри
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Genre>>> GetAll()
        {
            var genres = await _genreService.GetAllAsync();
            return Ok(genres);
        }

        /// <summary>
        /// Повертає жанр за ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Genre>> GetById(int id)
        {
            var genre = await _genreService.GetByIdAsync(id);
            if (genre == null) return NotFound();
            return Ok(genre);
        }

        /// <summary>
        /// Створює один жанр
        /// </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost]
        public async Task<ActionResult<Genre>> Create([FromBody] CreateGenreRequest request)
        {
            var genre = await _genreService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = genre.Id }, genre);
        }

        /// <summary>
        /// Створює багато жанрів за раз
        /// </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost("batch")]
        public async Task<ActionResult<IEnumerable<Genre>>> CreateMany([FromBody] IEnumerable<CreateGenreRequest> requests)
        {
            var genres = await _genreService.CreateManyAsync(requests);
            return Ok(genres);
        }

        /// <summary>
        /// Оновлює жанр
        /// </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateGenreRequest request)
        {
            await _genreService.UpdateAsync(id, request);
            return NoContent();
        }

        /// <summary>
        /// Видаляє жанр
        /// </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _genreService.DeleteAsync(id);
            return NoContent();
        }
    }
}
