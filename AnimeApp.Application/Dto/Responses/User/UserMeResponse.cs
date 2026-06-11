using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Responses.User
{
    public record UserMeResponse(
      int Id,
      string Nickname,
      string? AvatarUrl,
      UserRole Role,
     int UnreadNotificationsCount
    );
}
