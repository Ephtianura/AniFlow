using AnimeApp.Core.Models;

namespace AnimeApp.Application.Dto.Responses.User
{
        public record UserAnimeStatus(
             MyListEnum? MyList,
             int? Rating
            );
}
