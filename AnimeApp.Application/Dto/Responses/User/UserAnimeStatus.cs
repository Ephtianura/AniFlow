using AnimeApp.Core.Models;

namespace AnimeApp.Application.Dto.Responses.User
{
    public record UserAnimeStatus(
         int AnimeId,
         MyListEnum? MyList,
         int? Rating,
         bool? IsFavorite
        );
}
