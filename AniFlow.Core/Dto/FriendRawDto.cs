namespace AniFlow.Core.Dto
{
    public record FriendRawDto(
        int UserId,
        string Nickname,
        string? AvatarFileName,
        string? BannerFileName,
        DateTime? AcceptedAt
    );
}