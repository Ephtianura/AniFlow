namespace AnimeApp.Core.Dto
{
    public record PendingRawRequestDto(
        int UserId,
        string Nickname,
        string? AvatarFileName,
        DateTime CreatedAt
    );
}