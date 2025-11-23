using AnimeApp.Application.Dto.User;

namespace AnimeApp.Application.Contracts
{
    public interface IAuthService
    {
        Task<string> Login(LoginUserRequest request);
        Task RegisterAsync(RegisterUserRequest request);
    }
}