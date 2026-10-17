using AniFlow.Core.Models;

namespace AniFlow.Application.Contracts.Infra
{
    public interface IJwtProvider
    {
        string GenerateToken(User user);
    }
}