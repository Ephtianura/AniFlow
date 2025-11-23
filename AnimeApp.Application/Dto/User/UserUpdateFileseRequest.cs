using Microsoft.AspNetCore.Http;

namespace AnimeApp.Application.Dto.User
{
    public record UserUpdateFilesRequest(
         IFormFile? Avatar,
         string? AvatarUrl             
    );
}
