namespace AnimeApp.Infrastructure.Auth
{
    public class JwtOptions
    {
        public string Secretkey { get; set; } = string.Empty;
        public int ExpiresHours { get; set; }
    }
}