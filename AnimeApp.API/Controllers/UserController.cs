using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Dto.Responses.User;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.API.Controllers
{
    // ================= USER =================
    [Authorize(Policy = "UserPolicy")]
    [ApiController]
    [Route("api/user")]
    public class UserController(IUserService userService, IMapper mapper) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IMapper _mapper = mapper;

        /// <summary>Повертає коротку інформацію про себе</summary>
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = UserInfo.GetUserId(User);
            var user = await _userService.GetByIdAsync(userId);
            var response = _mapper.Map<GetUserMeResponse>(user);
            return Ok(response);
        }

        /// <summary>Оновлює профіль</summary>
        [HttpPatch("me")]
        public async Task<IActionResult> Update([FromBody] UserUpdateRequest request)
        {
            var userId = UserInfo.GetUserId(User);
            await _userService.UpdateProfileAsync(userId, request);
            return NoContent();
        }

        /// <summary>Оновлює аватар</summary>
        [HttpPatch("me/files")]
        public async Task<IActionResult> UpdateFiles([FromForm] UserUpdateFilesRequest request)
        {
            var userId = UserInfo.GetUserId(User);
            await _userService.UpdateFilesAsync(userId, request);
            return NoContent();
        }

        /// <summary>Повертає користувача по ID</summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            var response = _mapper.Map<GetUserMeResponse>(user);
            return Ok(response);
        }
    }
}
