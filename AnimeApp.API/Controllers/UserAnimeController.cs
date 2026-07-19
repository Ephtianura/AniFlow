using AnimeApp.API.Extensions.Dto;
using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Application.Services;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.API.Controllers
{
    // ================= USER ANIME =================
    [ApiController]
    [Route("api/user/me")]
    public class UserAnimeController(IUserAnimeService userAnimeService) : ControllerBase
    {
        private readonly IUserAnimeService _userAnimeService = userAnimeService;

        /// <summary>Повертає повну інформацію про свій профіль разом зі сводкою про переглянуті аніме</summary>
        [HttpGet("profile")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = Helper.GetUserIdOrThrow(User);
            var profile = await _userAnimeService.GetUserProfileAsync(userId);
            return Ok(profile);
        }

        /// <summary>Повертає список всіх аніме, які оцінено/додано до списку. Разом з підрахунком загальної кількості</summary>
        [HttpGet("animes")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> GetAnimeList(MyListEnum? myList, bool? isFavorite = null)
        {
            var userId = Helper.GetUserIdOrThrow(User);
            var userAnimeList = await _userAnimeService.GetUserAnimesAsync(userId, myList, isFavorite);
            return Ok(userAnimeList);
        }

        /// <summary>
        /// Повертає свою оцінку та список конкретного аніме.
        /// </summary>
        /// <remarks>
        /// Викликається, щоб побачити до якого списку додав користувач аніме та як оцінив.
        /// </remarks>
        [HttpGet("animes/{animeId}")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> GetUserAnimeStatus(int animeId)
        {
            var userId = Helper.GetUserIdOrThrow(User);
            var userAnimeStatus = await _userAnimeService.GetUserAnimeStatusAsync(userId, animeId);
            return Ok(userAnimeStatus);
        }

        /// <summary> Оцінює аніме або додає до власного списку </summary>
        [HttpPatch("{animeId}")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> UpdateUserAnime(int animeId, [FromBody] UpdateUserAnimeRequest request)
        {
            var userId = Helper.GetUserIdOrThrow(User);
            var command = new UpdateUserAnimeCommand()
            {
                UserId = userId,
                AnimeId = animeId,
                List = request.MyList,
                Rating = request.Rating,
                IsFavorite = request.IsFavorite
            };
            await _userAnimeService.UpdateAnimeStatusAsync(command);
            return NoContent();
        }

        /// <summary> Видаляє частини персонального статусу користувача для конкретного аніме. </summary>
        /// <remarks>
        /// Дозволяє частково очистити дані користувача:
        /// рейтинг, список перегляду та/або улюблене.
        /// Параметр <c>target</c> визначає, які саме поля будуть видалені.
        /// Якщо всі значення false — запит не має ефекту.
        /// </remarks>
        [HttpDelete("{animeId}")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> DeleteAnimeData(int animeId, [FromBody] DeleteStatusTargets target)
        {
            var userId = Helper.GetUserIdOrThrow(User);

            await _userAnimeService.RemoveUserStatusAsync(userId, animeId, target);

            return NoContent();
        }

        [HttpGet("/api/user/{id}/animes")]
        public async Task<IActionResult> GetUserAnimeList(int id, [FromQuery] ListRequest request)
        {
            var userAnimeList = await _userAnimeService.GetUserAnimesAsync(id, request.myList, request.isFavorite);
            return Ok(userAnimeList);
        }


        /// <summary>Повертає користувача по ID</summary>
        [HttpGet("/api/user/{id}")]
        public async Task<IActionResult> GetUsersProfileById(int id)
        {
            var currentUserId = Helper.GetUserIdOrNull(User);
            var user = await _userAnimeService.GetUsersProfileById(id, currentUserId);
            return Ok(user);
        }
    }
}
