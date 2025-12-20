using Microsoft.AspNetCore.Http;

namespace AnimeApp.Application.Dto.Requests.User
{
    public record UserUpdateFilesRequest(
         IFormFile? Avatar,
         string? AvatarUrl             
    );
}
