using AnimeApp.API.Dto;
using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeApp.API.Controllers
{
    // ================= AUTH =================
    [ApiController]
    [Route("api/auth")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        /// <summary> Реєструє нового користувача. </summary>
        /// <remarks>
        /// Потребує унікальний email.
        /// Після успішної реєстарції вхід автоматичний.
        /// </remarks>
        /// <response code="200">Користувач успішно зареєстрований і авторизований.</response>
        /// <response code="400">Помилка валідації даних.</response>
        /// <response code="409">Користувач з таким email вже існує.</response>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
        {
            await _authService.RegisterAsync(request);

            // Після реєстрації - автоматичний логін
            var token = await _authService.Login(new LoginUserRequest(request.Email, request.Password));

            SetAuthCookie(token);
            return Ok(new ApiResponse("User registered and logged in successfully"));
        }

        /// <summary> Аутентифікує користувача та встановлює токен доступу в cookie. </summary>
        /// <response code="200">Успішна аутентифікація</response>
        /// <response code="400">Некоректні дані</response>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserRequest request)
        {
            var token = await _authService.Login(request);
            SetAuthCookie(token);
            return Ok(new ApiResponse("Logged in"));
        }

        /// <summary>Інвалідує токен та видаляє його з cookie. </summary>
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Видалення токену з кукі 
            if (HttpContext.Request.Cookies.ContainsKey("cookies"))
            {
                HttpContext.Response.Cookies.Delete("cookies");
            }

            return Ok(new ApiResponse("Logged out"));
        }

        /// <summary> Тест для адміна. </summary>
        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("TestAdmin")]
        public IActionResult TestAdmin() => Ok(new ApiResponse("Admin endpoint works"));

        /// <summary> Тест для модератора. </summary>
        [Authorize(Policy = "ModeratorPolicy")]
        [HttpGet("TestEmployee")]
        public IActionResult TestEmployee() => Ok(new ApiResponse("Moderator endpoint works"));
      
        /// <summary> Метод, що встановлює кукі у відповідь. </summary>
        private void SetAuthCookie(string token) =>
            HttpContext.Response.Cookies.Append("cookies", token);
    }
}
