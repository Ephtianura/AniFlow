using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.User
{
    public class UserUpdateAdminRequest
    {
        public string? Nickname { get; set; }
        public string? Email { get; set; }
        public UserRole? Role { get; set; } 
    }
}
