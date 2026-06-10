using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Responses.User
{
    public record UserResponse(
         int Id,
         string Nickname,
         string? AvatarUrl,
         string? BannerUrl,

         bool IsOnline,
         string? LastOnline,

         DateTime DateOfRegistration,
         int TotalEpisodes,
         double AverageScore,
         TimeSpan TimeSpent
,
         FriendshipStatus? FriendshipStatus
     );
}