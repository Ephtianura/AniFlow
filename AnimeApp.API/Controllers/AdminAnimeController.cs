using AnimeApp.API.Dto;
using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.Requests;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Authorize(Policy = "AdminPolicy")]
    [Route("api/anime")]
    public class AdminAnimeController(
        IAnimeCommandService animeCommandService,
        IAnimeStatsService animeStatsService,
        IS3FileStorageService fileStorage) : ControllerBase
    {
        private readonly IAnimeCommandService _animeCommandService = animeCommandService;
        private readonly IAnimeStatsService _animeStatsService = animeStatsService;
        private readonly IS3FileStorageService _fileStorage = fileStorage;


        /// <summary> Створює нове аніме. </summary>
        [HttpPost]
        public async Task<ActionResult<AnimeCreateResponse>> Create([FromBody] AnimeCreateRequest request)
        {
            var response = await _animeCommandService.CreateAsync(request);
            return CreatedAtRoute(
                "GetAnimeById",
                new { id = response.Id },
                response
            );
        }

        /// <summary> Оновлює текстову інформацію про аніме. </summary>
        [HttpPatch("{id}")]
        public async Task<ActionResult> UpdateBase(int id, [FromBody] AnimeUpdateRequest request)
        {
            await _animeCommandService.UpdateBaseAsync(id, request);
            return Ok(new ApiResponse("Anime succesfully updated"));
        }

        /// <summary> Завантажує та оновлює файли (постер, скріншоти) через multipart/form-data. </summary>
        [HttpPatch("{id}/files")]
        public async Task<ActionResult> UpdateFiles(int id, [FromForm] AnimeUpdateFilesRequest request)
        {
            await _animeCommandService.UpdateFilesAsync(id, request);
            return Ok(new ApiResponse("Anime files succesfully updated"));
        }

        /// <summary>
        /// Синхронізує список скріншотів аніме та їх порядок.
        /// </summary>
        /// <remarks>
        /// Переданий список вважається кінцевим станом скріншотів аніме.
        /// Скріншоти, відсутні в запиті, будуть видалені.
        /// Нові скріншоти будуть додані. Але вони вже мусять бути попередньо завантажені за <b>/anime/screenshots/upload-file</b>
        /// Порядок елементів буде збережений відповідно до порядку в запиті.
        /// </remarks>
        /// <param name="id">Ідентифікатор аніме.</param>
        /// <param name="request">Список скріншотів у бажаному порядку відображення.</param>
        /// <response code="200">Список скріншотів успішно оновлено.</response>
        /// <response code="404">Аніме не знайдено.</response>
        [HttpPut("{id}/screenshots/sync")]
        public async Task<ActionResult> OrderScreenshots(int id, [FromBody] AnimeOrderScreenshotsRequest request)
        {
            await _animeCommandService.OrderScreenshots(id, request);
            return Ok(new ApiResponse("Screenshots successfully synchronized"));
        }
        /// <summary>
        /// Оновлює список пов'язаних аніме та синхронізує зворотні зв'язки.
        /// </summary>
        /// <param name="id">ID аніме, для якого оновлюються зв'язки.</param>
        /// <param name="request">Новий список пов'язаних аніме.</param>
        /// <returns>
        /// Актуальний стан зв'язків після оновлення, а також перелік змінених і видалених елементів.
        /// </returns>
        /// <response code="200">Зв'язки успішно оновлено.</response>
        /// <response code="404">Аніме не знайдено.</response>
        [HttpPut("{id}/related")]
        public async Task<ActionResult> UpdateRelated(int id, [FromBody] RelatedsAnimeRequest request)
        {
            var response = await _animeCommandService.UpdateRelated(id, request);
            return Ok(response);
        }

        /// <summary> Завантажує скріншот в S3 та повертає відносний шлях до файлу. </summary>
        [HttpPost("screenshots/upload-file")]
        public async Task<ActionResult> UploadScreenshotFile([FromForm] UploadFileRequest request)
        {
            using var stream = request.File.OpenReadStream();
            var fileName = await _fileStorage.UploadFileAsync(stream, request.File.FileName, StoragePaths.AnimeScreenshots);
            return Ok(new { url = fileName });
        }

        /// <summary> Завантажує скріншот в S3 по url та повертає відносний шлях до файлу. </summary>
        [HttpPost("screenshots/upload-url")]
        public async Task<ActionResult> UploadScreenshotUrl([FromBody] UploadUrlRequest request)
        {
            var fileName = await _fileStorage.UploadImageFromUrlAsync(request.Url, StoragePaths.AnimeScreenshots);
            if (fileName == null)
            {
                return BadRequest(new ApiResponse("Не вдалося завантажити зображення за вказаним URL"));
            }
            return Ok(new { url = fileName });
        }

        /// <summary> Повністю видаляє аніме. </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _animeCommandService.DeleteAsync(id);
            return NoContent();
        }

        /// <summary> Перераховує рейтинг для всіх аніме. </summary>
        [HttpPost("recalculate-ratings")]
        public async Task<IActionResult> RecalculateRatings()
        {
            await _animeStatsService.RecalculateAnimeStats();
            return Ok(new ApiResponse("Anime ratings successfully recalculated"));
        }


    }
}
