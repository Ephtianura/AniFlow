namespace AnimeApp.Application.Dto.Responses.User
{
    public record FriendResponse(
          int UserId,
          string Nickname,
          string? AvatarUrl,
          string? BannerUrl,
          DateTime? AcceptedAt,
          bool IsOnline
        );
}