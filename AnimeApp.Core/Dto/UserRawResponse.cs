namespace AnimeApp.Core.Dto
{
    public class UserRawResponse
    {
        public int Id { get; set; }
        public string Nickname { get; set; } = default!;
        public string? AvatarFileName { get; set; }
        public string? BannerFileName { get; set; }

        public DateTime LastOnline { get; set; }
        public DateTime DateOfRegistration { get; set; }
        public int TotalEpisodes { get; set; }
        public double AverageScore { get; set; }
        public double TimeSpentMinutes { get; set; }

        public UserRawResponse() { }

        public UserRawResponse(
            int id,
            string nickname,
            string? avatarFileName,
            string? bannerFileName,
            DateTime lastOnline,
            DateTime dateOfRegistration,
            int totalEpisodes,
            double averageScore,
            int timeSpentMinutes)
        {
            Id = id;
            Nickname = nickname;
            AvatarFileName = avatarFileName;
            BannerFileName = bannerFileName;
            LastOnline = lastOnline;
            DateOfRegistration = dateOfRegistration;
            TotalEpisodes = totalEpisodes;
            AverageScore = averageScore;
            TimeSpentMinutes = timeSpentMinutes;
        }
    }
}
