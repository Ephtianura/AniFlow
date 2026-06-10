namespace AnimeApp.Application.Dto.Responses.User
{
    public record UserResponse(
         int Id,
         string Nickname,
         string? AvatarUrl,
         string? BannerUrl,

         DateTime DateOfRegistration,
         int TotalEpisodes,
         double AverageScore,
         TimeSpan TimeSpent
     );
}