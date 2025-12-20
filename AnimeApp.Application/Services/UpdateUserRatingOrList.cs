using AnimeApp.Core.Models;

namespace AnimeApp.Application.Services
{
    public class UpdateUserRatingOrList
    {

        public int UserId {get; set;}
        public int AnimeId {get; set;}
        public MyListEnum? List { get; set; } = null;
        public int? Rating { get; set; } = null;
    }
}