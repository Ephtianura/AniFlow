using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Exceptions;
using AnimeApp.Application.Services;
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
    public class UserController(IUserService userService, IMapper mapper, IS3FileStorageService fileUrl) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IMapper _mapper = mapper;
        private readonly IS3FileStorageService _fileUrl = fileUrl;

        /// <summary>Отримати користувача по айді</summary>
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = GetUserId();
            var user = await _userService.GetByIdAsync(userId);
            var response = _mapper.Map<GetUserMeResponse>(user);
            return Ok(response);
        }

        /// <summary>Отримати свій профіль</summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            var user = await _userService.GetUserProfileAsync(userId);

            var response = _mapper.Map<UserProfileUrlsResponse>(user);

            if (!string.IsNullOrWhiteSpace(user.AvatarFileName))
                response.AvatarUrl = _fileUrl.GetUrl(user.AvatarFileName);
            return Ok(response);
        }

        [HttpGet("profile/animes")]
        public async Task<IActionResult> GetAnimeList(MyListEnum? myList)
        {
            var userId = GetUserId();
            if (myList == null)
            {
                var userAnimeList = await _userService.GetUserAnimeListAsync(userId);
                return Ok(userAnimeList);
            }
            else
            {
                var userAnimeList = await _userService.GetUserAnimesByStatusAsync(userId, myList);
                return Ok(userAnimeList);
            }


        }

        /// <summary>Оновити профіль</summary>
        [HttpPut("UpdateProfile")]
        public async Task<IActionResult> Update([FromBody] UserUpdateRequest request)
        {
            var userId = GetUserId();
            await _userService.UpdateProfileAsync(userId, request);
            return NoContent();
        }

        /// <summary>Оновити аватар</summary>
        [HttpPut("UpdateFiles")]
        public async Task<IActionResult> UpdateFiles([FromForm] UserUpdateFilesRequest request)
        {
            var userId = GetUserId();
            await _userService.UpdateFilesAsync(userId, request);
            return NoContent();
        }

        /// <summary>Оновити рейтинг аніме або список</summary>
        [HttpPut("UpdateUserAnime")]
        public async Task<IActionResult> UpdateUserAnime([FromBody] int animeId, MyListEnum? myList, int? rating)
        {
            var userId = GetUserId();
            var request = new UpdateUserRatingOrList()
            {
                UserId = userId,
                AnimeId = animeId,
                List = myList,
                Rating = rating
            };
            await _userService.AddOrUpdateAnimeAsync(request);
            return NoContent();
        }

        // Достати userId з токену
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
