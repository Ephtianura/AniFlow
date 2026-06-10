namespace AnimeApp.Application.Dto.Responses.User
{
    public record PendingRequestResponse(
           int UserId,
           string Nickname,
           string? AvatarFileName,
           DateTime CreatedAt,
           bool IsOnline
        );
}