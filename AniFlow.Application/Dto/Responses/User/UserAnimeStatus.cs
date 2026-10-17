using AniFlow.Core.Enums;

namespace AniFlow.Application.Dto.Responses.User
{
    public record UserAnimeStatus(
         int AnimeId,
         MyListEnum? MyList,
         int? Rating,
         bool? IsFavorite
    );
}
