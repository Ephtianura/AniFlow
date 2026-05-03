using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts.Infra
{
    public interface IJwtProvider
    {
        string GenerateToken(User user);
    }
}