using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Responses.User
{
    public record GetUserMeResponse(
      int Id,
      string Nickname,
      string? AvatarUrl,
      string Email,
      UserRole Role
  );
}
