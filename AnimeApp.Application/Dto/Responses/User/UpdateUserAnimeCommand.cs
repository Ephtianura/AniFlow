using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Responses.User
{
    public class UpdateUserAnimeCommand
    {
        public int UserId {get; set;}
        public int AnimeId {get; set;}
        public MyListEnum? List { get; set; } = null;
        public int? Rating { get; set; } = null;
        public bool? IsFavorite { get; set; } = null;
    }
}