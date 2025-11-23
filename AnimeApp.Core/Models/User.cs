using AnimeApp.Core.Enums;
using System.Net.Mail;


namespace AnimeApp.Core.Models
{
    public class User
    {
        public User() { }
      
        private User(string nickname, string email, string passwordHash)
        {
            ChangeNickname(nickname);
            ChangeEmail(email);
            ChangePassword(passwordHash);
            Role = UserRole.User;
            DateOfRegistration = DateTime.UtcNow;
            Theme = ThemeEnum.Light;
        }
            
        public int Id { get; private set; }

        // 👤 Основні
        public string Nickname { get; private  set; } = null!;
        public string Email { get; private set; } = null!;
        public string PasswordHash { get; private set; } = null!;
        public UserRole Role { get; private set; }
        public string? AvatarFileName { get; private set; }

        // 📅 Дати
        public DateTime DateOfRegistration { get; private set; } 

        // ⚙️ Налаштування
        public ThemeEnum Theme { get; private set; }

        // 📺 Списки
        public ICollection<UserAnime> UserAnimes { get; private set; } = [];

        // ===================== Створення =====================
        public static User Create(string nickname, string email, string passwordHash)
        {
            return new User(nickname, email, passwordHash);
        }

        // ===================== Оновлення =====================
        public void ChangeNickname(string newNickname)
        {
            if (string.IsNullOrWhiteSpace(newNickname))
                throw new ArgumentException("Nickname cannot be empty");
            Nickname = newNickname.Trim();
        }
        public void ChangeEmail(string newEmail)
        {
            if (string.IsNullOrWhiteSpace(newEmail))
                throw new ArgumentException("Email cannot be empty");
            try
            {
                var _ = new MailAddress(newEmail);
            }
            catch (FormatException)
            {
                throw new ArgumentException("Email format is invalid");
            }
            Email = newEmail.Trim().ToLower();
        }
        public void ChangePassword(string newPasswordHash)
        {
            if (string.IsNullOrWhiteSpace(newPasswordHash))
                throw new ArgumentException("Password cannot be empty");
            PasswordHash = newPasswordHash;
        }
        public void ChangeRole(UserRole newRole)
        {
            if (!Enum.IsDefined(typeof(UserRole), newRole))
                throw new ArgumentException("Invalid user role");
            Role = newRole;
        }
        public void ChangeTheme(ThemeEnum newTheme)
        {
            if (!Enum.IsDefined(typeof(ThemeEnum), newTheme))
                throw new ArgumentException("Invalid theme");
            Theme = newTheme;
        }
        public void ChangeAvatarFileName(string? avatarFileName)
        {
            AvatarFileName = avatarFileName;
        }



    }
}
