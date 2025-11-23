using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts
{
    public interface IJwtProvider
    {
        string GenerateToken(User user);
    }
}