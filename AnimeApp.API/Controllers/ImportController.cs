using AnimeApp.API.Dto;
using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Commands;
using AnimeApp.Application.Dto.Responses.Anime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Authorize(Policy = "AdminPolicy")]
    [Route("api/import")]
    public class ImportController(IAnimeSyncService syncService, IAnimeImportService importService) : ControllerBase
    {
        private readonly IAnimeImportService _importService = importService;
        private readonly IAnimeSyncService _syncService = syncService;

        /// <summary> Заповнює каталог айдішками з MoonAPI. </summary>
        [HttpPost("ids/seed")]
        public async Task<ActionResult> DumpMoonDbToCatalog()
        {
            var res = await _syncService.DumpMoonDbToCatalog();
            return Ok(new ApiResponse<CreatedCountResult>("Каталог успішно заповнений!", res));
        }
        /// <summary> Запускає процесс парсінгу всіх аніме з MoonAPI. </summary>
        /// <remarks><b>ВИКОРИСТОВУВАТИ ВСЬОГО ОДИН РАЗ</b></remarks>
        [HttpPost("anime/seed")]
        public async Task<ActionResult> SeedDbFromCatalog()
        {
            await _syncService.SeedDbFromCatalog();
            return Ok(new ApiResponse("Процес заповнення запущений."));
        }

        /// <summary> Імпортує аніме по Moon Id. </summary>
        [HttpPost("anime/{moonId}")]
        public async Task<ActionResult> ParseNewAnime(int moonId)
        {
            await _importService.ParseNewAnime(new ParseNewAnimeCommand(moonId));
            return Ok(new ApiResponse("Аніме успішно створене!"));
        }

        /// <summary>
        /// Примусово ініціює оновлення технічних полей аніме.
        /// Оновлення відбудеться, тільки в разі якщо в MoonAPI були зміни.
        /// </summary>
        [HttpPatch("anime/{moonId}")]
        public async Task<ActionResult> UpdateTechFields(int moonId)
        {
            await _importService.UpdateTechFields(new UpdateAnimeCommand(moonId, DateTime.UtcNow));
            return Ok(new ApiResponse("Оновленя успішне!"));
        }

        /// <summary>
        /// Перевіряє останні оновлення аніме.
        /// Якщо буде виявлено нове аніме - воно буде створене
        /// </summary>
        [HttpPost("anime/check")]
        public async Task<ActionResult> CheckLastUpdated()
        {
            await _syncService.CheckLastUpdated();
            return Ok(new ApiResponse("Процес перевірки запущений."));
        }

        /// <summary> Запускає процесс парсінгу всіх жанрів з MoonAPI. </summary>
        [HttpPost("genres/seed")]
        public async Task<ActionResult> SeedDbWithGenres()
        {
            var response = await _syncService.SeedDbWithGenres();
            return Ok(new ApiResponse<CreateUpdateResult>(
                "Синхронізація жанрів завершена успішно!",
                response
            ));
        }

    }
}
