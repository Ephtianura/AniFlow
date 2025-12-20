using AnimeApp.Core.Models;

namespace AnimeApp.Application.Dto.Requests.User
{
    public class UserUpdateRequest
    {
        public string? Nickname { get; set; }        
        public string? Email { get; set; }          
        public string? Password { get; set; }
        public ThemeEnum? Theme { get; private set; }
    }
}