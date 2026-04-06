using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.API.Controllers
{
    // ================= USER =================
    [Authorize(Policy = "UserPolicy")]
    [ApiController]
    [Route("api/user")]
    public class UserController(IUserService userService, IMapper mapper, IS3FileStorageService fileUrl, IUserAnimeService userAnimeService) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IUserAnimeService _userAnimeService = userAnimeService;
        private readonly IMapper _mapper = mapper;
        private readonly IS3FileStorageService _fileUrl = fileUrl;

        /// <summary>Отримати коротку інформацію про себе</summary>
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = GetUserId();
            var user = await _userService.GetByIdAsync(userId);
            var response = _mapper.Map<GetUserMeResponse>(user);
            return Ok(response);
        }

        /// <summary>Оновити профіль</summary>
        [HttpPatch("me")]
        public async Task<IActionResult> Update([FromBody] UserUpdateRequest request)
        {
            var userId = GetUserId();
            await _userService.UpdateProfileAsync(userId, request);
            return NoContent();
        }

        /// <summary>Оновити аватар</summary>
        [HttpPatch("me/files")]
        public async Task<IActionResult> UpdateFiles([FromForm] UserUpdateFilesRequest request)
        {
            var userId = GetUserId();
            await _userService.UpdateFilesAsync(userId, request);
            return NoContent();
        }

        /// <summary>Отримати інформацію про свій профіль разом зі сводкою про переглянуті аніме</summary>
        [HttpGet("me/profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            var user = await _userAnimeService.GetUserProfileAsync(userId);

            var response = _mapper.Map<UserProfileUrlsResponse>(user);

            if (!string.IsNullOrWhiteSpace(user.AvatarFileName))
                response.AvatarUrl = _fileUrl.GetUrl(user.AvatarFileName);
            return Ok(response);
        }

        /// <summary>Отримати список всіх аніме, які оцінено/додано до списку. Разом з підрахунком загальної кількості</summary>
        [HttpGet("me/animes")]
        public async Task<IActionResult> GetAnimeList(MyListEnum? myList)
        {
            var userId = GetUserId();
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
        /// Отримати свою оцінку та список в аніме.
        /// Ендпойнт, який викликається, щоб побачити до якого списку додав користувач аніме та як оцінив.
        /// </summary>
        [HttpGet("me/animes/{animeId}")]
        public async Task<IActionResult> GetUserAnimeStatus(int animeId)
        {
            var userId = GetUserId();

            var userAnimeStatus = await _userAnimeService.GetUserAnimeStatusAsync(userId, animeId);

            return Ok(userAnimeStatus);
        }

        /// <summary>Оцінити аніме або додати до списку</summary>
        [HttpPatch("me/{animeId}")]
        public async Task<IActionResult> UpdateUserAnime(int animeId, [FromBody] UpdateUserAnimeRequest request)
        {
            var userId = GetUserId();
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

        /// <summary>Отримати користувача по айді</summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            var response = _mapper.Map<GetUserMeResponse>(user);
            return Ok(response);
        }

        /// <summary>Достати userId з токену</summary>
        private int GetUserId()
        {
            // Виймаємо userId з токена
            var userIdClaim = User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                throw new MissingUserIdClaimException();
            if (!int.TryParse(userIdClaim, out var userId))
                throw new InvalidUserIdFormatException();

            return userId;
        }
    }
}
