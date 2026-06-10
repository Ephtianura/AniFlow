using AnimeApp.API.Controllers;
using AnimeApp.API.Dto;
using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Dto.Responses.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AnimeApp.Api.Controllers
{
    [ApiController]
    [Route("api/friends")]
    [Authorize(Policy = "UserPolicy")]
    public class UserFriendsController(IUserFriendService userFriendService) : ControllerBase
    {
        private readonly IUserFriendService _userFriendService = userFriendService;

        [HttpPost("request/{targetUserId:int}")]
        public async Task<IActionResult> SendRequest(int targetUserId)
        {
            var currentUserId = Helper.GetUserIdOrThrow(User);
            await _userFriendService.SendFriendRequestAsync(currentUserId, targetUserId);

            return Ok(new ApiResponse("Заявку в друзі успішно відправлено."));
        }

        [HttpPost("accept/{friendId:int}")]
        public async Task<IActionResult> AcceptFriendship(int friendId)
        {
            var currentUserId = Helper.GetUserIdOrThrow(User);
            await _userFriendService.AcceptFriendshipAsync(currentUserId, friendId);
            return Ok(new ApiResponse("Заявку прийнято. Тепер ви друзі!"));
        }

        [HttpDelete("{targetUserId:int}")]
        public async Task<IActionResult> RemoveFriendship(int targetUserId)
        {
            var currentUserId = Helper.GetUserIdOrThrow(User);
            await _userFriendService.RemoveFriendshipOrRequestAsync(currentUserId, targetUserId);

            return Ok(new ApiResponse("Зв'язок успішно видалено."));
        }

        [HttpGet("requests")]
        public async Task<ActionResult<List<PendingRequestResponse>>> GetIncomingRequests()
        {
            var currentUserId = Helper.GetUserIdOrThrow(User);
            var requests = await _userFriendService.GetIncomingRequestsAsync(currentUserId);

            return Ok(requests);
        }

        [HttpGet]
        public async Task<ActionResult<List<FriendResponse>>> GetFriendsList()
        {
            var currentUserId = Helper.GetUserIdOrThrow(User);
            var friends = await _userFriendService.GetFriendsListAsync(currentUserId);

            return Ok(friends);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<List<FriendResponse>>> GetFriendsList(int id)
        {
            var friends = await _userFriendService.GetFriendsListAsync(id);

            return Ok(friends);
        }

    }
}