using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Requests.User
{
    public class UpdateUserAnimeRequest
    {
        public MyListEnum? MyList { get; set; }
        public int? Rating { get; set; }
        public bool? IsFavorite { get; set; }
    }
}