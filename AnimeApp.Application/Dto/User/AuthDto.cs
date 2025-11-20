using System.ComponentModel.DataAnnotations;

namespace AnimeApp.Application.Dto.User
{
    public record RegisterUserRequest(
            [Required] string FullName,
            [Required] string Email,
            [Required] string Password);

    public record LoginUserRequest(
        [Required] string Email,
        [Required] string Password);

}