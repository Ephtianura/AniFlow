using Microsoft.AspNetCore.Http;

namespace AniFlow.Application.Dto.Requests.User
{
    public record UserUpdateFilesRequest(
         IFormFile? Avatar,
         IFormFile? Banner
    );
}
