using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Responses.User
{
    public record UserAnimeStatus(
         int AnimeId,
         MyListEnum? MyList,
         int? Rating,
         bool? IsFavorite
    );
}
