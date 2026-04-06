using AnimeApp.Core.Models;

namespace AnimeApp.Application.Dto.Responses.User
{
    public class UpdateUserAnimeCommand
    {
        public int UserId {get; set;}
        public int AnimeId {get; set;}
        public MyListEnum? List { get; set; } = null;
        public int? Rating { get; set; } = null;
    }
}