using System.Security.Cryptography;
using System.Text;
using AnimeApp.API.Controllers;

namespace AnimeApp.API.Helpers
{
    public static class UserIdentificationService
    {
        public static string GetUniqueVisitorId(HttpContext? httpContext)
        {
            if (httpContext == null) return "unknown_visitor";

            // Якщо користувач авторизований, його унікальний ID — його UserId
            if (httpContext.User?.Identity?.IsAuthenticated == true)
            {
                var userId = Helper.GetUserIdOrNull(httpContext.User);
                if (userId is not null)
                {
                    return $"user_{userId}";
                }
            }

            // Якщо гість – намагаємось дістати куку guest_session_id
            if (httpContext.Request.Cookies.TryGetValue("guest_session_id", out var guestGuid) && !string.IsNullOrEmpty(guestGuid))
            {
                return $"guest_cookie_{guestGuid}";
            }

            // Фолбек, якщо куки ще немає, збираємо відбиток IP + User-Agent
            string ip = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                        ?? httpContext.Connection.RemoteIpAddress?.ToString()
                        ?? "unknown_ip";
            string userAgent = httpContext.Request.Headers["User-Agent"].ToString() ?? "unknown_ua";

            // Хешуємо 
            var rawData = $"{ip}_{userAgent}";
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawData));
            return $"guest_track_{Convert.ToHexString(bytes)[..16]}";
        }
    }
}