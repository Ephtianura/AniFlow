namespace AnimeApp.Application.Dto.Responses.User
{
    public record UserUpdateFilesResponse(
         string? AvatarUrl,
         string? BannerUrl
    );
}
