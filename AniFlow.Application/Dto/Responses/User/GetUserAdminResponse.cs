using AniFlow.Core.Enums;

namespace AniFlow.Application.Dto.Responses.User
{
    public record GetUserAdminResponse(
     int Id,
     string Nickname,
     string? AvatarUrl,
     UserRole Role
 );
}
