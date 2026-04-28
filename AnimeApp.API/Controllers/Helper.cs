using AnimeApp.Application.Exceptions;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace AnimeApp.API.Controllers
{
    public static class Helper
    {
        /// <summary>
        /// Повертає UserId або викликає Exception
        /// </summary>
        /// <exception cref="MissingUserIdClaimException"></exception>
        /// <exception cref="InvalidUserIdFormatException"></exception>
        public static int GetUserIdOrThrow(ClaimsPrincipal user)
        {
            ArgumentNullException.ThrowIfNull(user);

            var userIdClaim = user.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                throw new MissingUserIdClaimException();
            if (!int.TryParse(userIdClaim, out var userId))
                throw new InvalidUserIdFormatException();

            return userId;
        }

        /// <summary>
        /// Повертає UserId або null
        /// </summary>
        /// <exception cref="MissingUserIdClaimException"></exception>
        /// <exception cref="InvalidUserIdFormatException"></exception>
        public static int? GetUserIdOrNull(ClaimsPrincipal user)
        {
            if (user is null)
                return null;

            var userIdClaim = user.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return null;

            if (!int.TryParse(userIdClaim, out var userId))
                return null;

            return userId;
        }

        /// <summary>
        /// Вирізає Id аніме зі slug
        /// </summary>
        public static int? ExtractId(string slug)
        {
            var match = Regex.Match(slug, @"-(\d+)$");
            if (!match.Success) return null;

            return int.Parse(match.Groups[1].Value);
        }
    }
}
