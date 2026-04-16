using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Core.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.API.Controllers
{
    // ================= USER =================
    [Authorize(Policy = "UserPolicy")]
    [ApiController]
    [Route("api/user/me")]
    public class UserAnimeController(IMapper mapper, IS3FileStorageService fileUrl, IUserAnimeService userAnimeService) : ControllerBase
    {
        private readonly IUserAnimeService _userAnimeService = userAnimeService;
        private readonly IMapper _mapper = mapper;
        private readonly IS3FileStorageService _fileUrl = fileUrl;


        /// <summary>Повертає повну інформацію про свій профіль разом зі сводкою про переглянуті аніме</summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = UserInfo.GetUserId(User);
            var user = await _userAnimeService.GetUserProfileAsync(userId);

            var response = _mapper.Map<UserProfileUrlsResponse>(user);

            if (!string.IsNullOrWhiteSpace(user.AvatarFileName))
                response.AvatarUrl = _fileUrl.GetUrl(user.AvatarFileName);
            return Ok(response);
        }

        /// <summary>Повертає список всіх аніме, які оцінено/додано до списку. Разом з підрахунком загальної кількості</summary>
        [HttpGet("animes")]
        public async Task<IActionResult> GetAnimeList(MyListEnum? myList)
        {
            var userId = UserInfo.GetUserId(User);
            if (myList is null)
            {
                var userAnimeList = await _userAnimeService.GetUserAnimeListAsync(userId);
                return Ok(userAnimeList);
            }
            else
            {
                var userAnimeList = await _userAnimeService.GetUserAnimesByStatusAsync(userId, myList);
                return Ok(userAnimeList);
            }
        }

        /// <summary>
        /// Повертає свою оцінку та список конкретного аніме.
        /// </summary>
        /// <remarks>
        /// Ендпойнт, який викликається, щоб побачити до якого списку додав користувач аніме та як оцінив.
        /// </remarks>
        [HttpGet("animes/{animeId}")]
        public async Task<IActionResult> GetUserAnimeStatus(int animeId)
        {
            var userId = UserInfo.GetUserId(User);
            var userAnimeStatus = await _userAnimeService.GetUserAnimeStatusAsync(userId, animeId);
            return Ok(userAnimeStatus);
        }

        /// <summary>Оцінює аніме або додає до власного списку</summary>
        [HttpPatch("{animeId}")]
        public async Task<IActionResult> UpdateUserAnime(int animeId, [FromBody] UpdateUserAnimeRequest request)
        {
            var userId = UserInfo.GetUserId(User);
            var command = new UpdateUserAnimeCommand()
            {
                UserId = userId,
                AnimeId = animeId,
                List = request.MyList,
                Rating = request.Rating
            };
            await _userAnimeService.UpdateAnimeStatusAsync(command);
            return NoContent();
        }

        [HttpDelete("{animeId}")]
        public async Task<IActionResult> DeleteAnimeData(int animeId, [FromQuery] DeleteStatusTargets target)
        {
            var userId = UserInfo.GetUserId(User);
           
            await _userAnimeService.RemoveUserStatusAsync(userId, animeId, target);

            return NoContent();
        }
    }
}
