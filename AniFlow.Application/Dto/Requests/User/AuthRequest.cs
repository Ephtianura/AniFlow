using System.ComponentModel.DataAnnotations;

namespace AniFlow.Application.Dto.Requests.User
{
    public record RegisterUserRequest(
            [Required] string Nickname,
            [Required] string Email,
            [Required] string Password
    );

    public record LoginUserRequest(
        [Required] string Email,
        [Required] string Password
    );
}
