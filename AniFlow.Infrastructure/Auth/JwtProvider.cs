using AniFlow.Core.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using System.Text;
using System.Security.Claims;
using AniFlow.Application.Contracts.Infra;


namespace AniFlow.Infrastructure.Auth
{
    public class JwtProvider(IOptions<JwtOptions> options) : IJwtProvider
    {
        private readonly JwtOptions _options = options.Value;

        public string GenerateToken(User user)
        {
            Claim[] claims =
                [
                    new ("userId", user.Id.ToString()),
                    new (ClaimTypes.Name, user.Nickname),
                    new (ClaimTypes.Email, user.Email),
                    new (ClaimTypes.Role, user.Role.ToString())
                ];

            var signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Secretkey)),
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(_options.ExpiresHours),
                signingCredentials: signingCredentials
            );

            var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

            return tokenValue;
        }

    }
}
