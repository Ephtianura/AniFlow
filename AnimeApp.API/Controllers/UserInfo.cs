using AnimeApp.Application.Exceptions;
using System.Security.Claims;

namespace AnimeApp.API.Controllers
{
    public static class UserInfo
    {
        public static int GetUserId(ClaimsPrincipal user)
        {
            ArgumentNullException.ThrowIfNull(user);

            var userIdClaim = user.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                throw new MissingUserIdClaimException();
            if (!int.TryParse(userIdClaim, out var userId))
                throw new InvalidUserIdFormatException();

            return userId;
        }
    }
}
