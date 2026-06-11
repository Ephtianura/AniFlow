using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Dto
{
    public class UserMeRawResponse
    {
        public int Id { get; set; }
        public string Nickname { get; set; } = null!;
        public string? AvatarFileName { get; set; }
        public UserRole Role { get; set; }
        public int UnreadNotificationsCount { get; set; }
    }
}
