using AnimeApp.Application.Dto.Requests.User;

namespace AnimeApp.Application.Contracts.App
{
    public interface IAuthService
    {
        Task<string> Login(LoginUserRequest request);
        Task RegisterAsync(RegisterUserRequest request);
    }
}