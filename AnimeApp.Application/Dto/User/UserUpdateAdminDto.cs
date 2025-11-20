using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.User
{
    public class UserUpdateAdminDto
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public UserRole? Role { get; set; } 
    }
}
