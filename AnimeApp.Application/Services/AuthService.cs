//using AnimeApp.Application.Contracts;
//using AnimeApp.Application.Dto.User;
//using AnimeApp.Application.Exceptions;
//using AnimeApp.Core.Contracts;
//using AnimeApp.Core.Models;
//using FluentValidation;

//namespace AnimeApp.Application.Services
//{
//    //================== AUTH ==================
//    public class AuthService : IAuthService
//    {
//        private readonly IUserRepository _users;
//        private readonly IPasswordHasher _passwordHasher;
//        private readonly IJwtProvider _jwtProvider;
//        private readonly IValidator<RegisterUserRequest> _registerValidator;
//        private readonly IValidator<LoginUserRequest> _loginValidator;

//        public AuthService
//            (
//            IUserRepository users, 
//            IPasswordHasher passwordHasher, 
//            IJwtProvider jwtProvider, 
//            IValidator<RegisterUserRequest> registerValidator,
//            IValidator<LoginUserRequest> loginValidator
//            )
//        {
//            _users = users;
//            _passwordHasher = passwordHasher;
//            _jwtProvider = jwtProvider;
//            _registerValidator = registerValidator;
//            _loginValidator = loginValidator;
//        }

//        // Реєстрація
//        public async Task RegisterAsync(RegisterUserRequest request)
//        {
//            // Валідація
//            await _registerValidator.ValidateAndThrowAsync(request);          

//            // Нормалізація ел. адреси
//            var emailNormalized = NormalizeEmail(request.Email);

//            // Отримання ел. адреси 
//            var existingByEmail = await _users.GetByEmailAsync(emailNormalized);
//            if (existingByEmail != null)
//                throw new EmailAlreadyExistsException(emailNormalized);

//            // Генерація хеша
//            var hashedPassword = _passwordHasher.Generate(request.Password);

//            // Створення користувача в БД            
//            var user = User.Create(request.FullName, emailNormalized, hashedPassword);

//            // Збереження
//            await _users.AddAsync(user);
//        }

//        // Вхід
//        public async Task<string> Login(LoginUserRequest request)
//        {
//            // Валідація
//            await _loginValidator.ValidateAndThrowAsync(request);            

//            // Нормалізація ел. адреси
//            var emailNormalized = NormalizeEmail(request.Email);

//            // Отримання ел. адреси 
//            var user = await _users.GetByEmailAsync(emailNormalized);

//            // Перевірка логіна і пароля 
//            if (user == null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
//                throw new AuthenticationException();

//            // Генерація JWT
//            var token = _jwtProvider.GenerateToken(user);
//            return token;
//        }

//        private string NormalizeEmail(string email) => email.Trim().ToLower();
//    }
//}
