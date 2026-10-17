using AniFlow.Core.Enums;

namespace AniFlow.Application.Dto.Requests.User
{
    public class UserUpdateAdminRequest
    {
        public string? Nickname { get; set; }
        public string? Email { get; set; }
        public UserRole? Role { get; set; } 
    }
}
