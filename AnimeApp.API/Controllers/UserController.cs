using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.User;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.API.Controllers
{
    // ================= USER =================
    [ApiController]
    [Route("api/user")]
    public class UserController(IUserService userService, IMapper mapper) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IMapper _mapper = mapper;

        /// <summary>Повертає коротку інформацію про себе</summary>
        [HttpGet("me")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> GetMe()
        {
            var userId = Helper.GetUserIdOrThrow(User);
            var user = await _userService.GetByIdAsync(userId);
            return Ok(user);
        }

        /// <summary>Оновлює профіль</summary>
        [HttpPatch("me")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> Update([FromBody] UserUpdateRequest request)
        {
            var userId = Helper.GetUserIdOrThrow(User);
            await _userService.UpdateProfileAsync(userId, request);
            return NoContent();
        }

        /// <summary>Оновлює аватар</summary>
        /// <returns>Урл на поточні аватар та постер</returns>
        [HttpPatch("me/files")]
        [Authorize(Policy = "UserPolicy")]
        public async Task<IActionResult> UpdateFiles([FromForm] UserUpdateFilesRequest request)
        {
            var userId = Helper.GetUserIdOrThrow(User);
            var res = await _userService.UpdateFilesAsync(userId, request);
            return Ok(res);
        }

    }
}
