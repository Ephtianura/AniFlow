using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.User;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;
using FluentValidation;

namespace AnimeApp.Application.Services
{
    //================== AUTH ==================
    public class AuthService
        (
        IUserRepository users,
        IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider
            ) : IAuthService
    {
        private readonly IUserRepository _users = users;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;
        private readonly IJwtProvider _jwtProvider = jwtProvider;

        // Реєстрація
        public async Task RegisterAsync(RegisterUserRequest request)
        {
            // Нормалізація ел. адреси
            var emailNormalized = NormalizeEmail(request.Email);

            // Отримання ел. адреси 
            var existingByEmail = await _users.GetByEmailAsync(emailNormalized);
            if (existingByEmail != null)
                throw new EmailAlreadyExistsException(emailNormalized);

            // Генерація хеша
            var hashedPassword = _passwordHasher.Generate(request.Password);

            // Створення користувача в БД            
            var user = User.Create(request.Nickname, emailNormalized, hashedPassword);

            // Збереження
            await _users.AddAsync(user);
        }

        // Вхід
        public async Task<string> Login(LoginUserRequest request)
        {
            // Нормалізація ел. адреси
            var emailNormalized = NormalizeEmail(request.Email);

            // Отримання ел. адреси 
            var user = await _users.GetByEmailAsync(emailNormalized);

            // Перевірка логіна і пароля 
            if (user == null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
                throw new AuthenticationException();

            // Генерація JWT
            var token = _jwtProvider.GenerateToken(user);
            return token;
        }

        private string NormalizeEmail(string email) => email.Trim().ToLower();
    }
}
