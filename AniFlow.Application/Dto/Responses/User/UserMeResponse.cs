using AniFlow.Core.Enums;

namespace AniFlow.Application.Dto.Responses.User
{
    public record UserMeResponse(
      int Id,
      string Nickname,
      string? AvatarUrl,
      UserRole Role,
     int UnreadNotificationsCount
    );
}
