using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Responses.User
{
    public record GetUserAdminResponse(
     int Id,
     string Nickname,
     string? AvatarUrl,
     UserRole Role
 );
}
