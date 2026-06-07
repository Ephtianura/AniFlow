using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Dto.Requests.Studio;
using AnimeApp.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/studios")]
    public class StudiosController(IStudioService studioService) : ControllerBase
    {
        private readonly IStudioService _studioService = studioService;

        /// <summary> Повертає інформацію про студію за ID та всі аніме студії </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var studio = await _studioService.GetByIdAsync(id);
            return Ok(studio);
        }

        /// <summary> Повертає студії за фільтром </summary>
        [HttpGet]
        public async Task<ActionResult> GetFiltered([FromQuery] StudioFilter filter)
        {
            var studios = await _studioService.GetAllAsync(filter);
            return Ok(studios);
        }

        // ==================== Адмін права ====================

        /// <summary> Створює нову студію </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateStudioRequest request)
        {
            var response = await _studioService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }

        /// <summary> Завантажує постер для студії через form-data </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpPatch("{id}/files")]
        public async Task<ActionResult<Studio>> UploadFiles(int id, IFormFile? Poster)
        {
            await _studioService.UpdateFilesAsync(id, Poster);
            return NoContent();
        }

        /// <summary> Оновлює інформацію про студію </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateStudioRequest request)
        {
            await _studioService.UpdateAsync(id, request);
            return NoContent();
        }

        /// <summary> Видаляє студію </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _studioService.DeleteAsync(id);
            return NoContent();
        }
    }
}
