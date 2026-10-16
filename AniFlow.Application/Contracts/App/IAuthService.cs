using AniFlow.Application.Dto.Requests.User;

namespace AniFlow.Application.Contracts.App
{
    public interface IAuthService
    {
        Task<string> Login(LoginUserRequest request);
        Task RegisterAsync(RegisterUserRequest request);
    }
}