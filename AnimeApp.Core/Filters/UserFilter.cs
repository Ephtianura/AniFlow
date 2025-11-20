using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Filters
{
    public class UserFilter
    {
        public string? Search { get; set; }       // Пошук по імені та пошті
        public UserRole? Role { get; set; }       // Фільтр по ролі
        public DateTimeOffset? RegisteredFrom { get; set; }
        public DateTimeOffset? RegisteredTo { get; set; }
        public string? SortBy { get; set; }       // Сортування за - "FullName", "Email", "RegistrationDate"
        public bool SortDesc { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}

