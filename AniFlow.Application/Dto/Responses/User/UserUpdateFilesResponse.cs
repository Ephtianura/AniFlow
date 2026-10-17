namespace AniFlow.Application.Dto.Responses.User
{
    public record UserUpdateFilesResponse(
         string? AvatarUrl,
         string? BannerUrl
    );
}
