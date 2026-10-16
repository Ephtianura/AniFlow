using AniFlow.Core.Enums;
using AniFlow.Core.Models;

namespace AniFlow.Core.Dto
{
    public record UserAnimeWithDetails
     (
        MyListEnum? MyList,
        int? Rating,
        bool IsFavorite,
        AnimeDto Anime
    );

    public record AnimeDto
     (
        int Id,
        string? PosterFileName,
        AnimeKindEnum? Kind,
        int? Episodes,
        double Score,
        int TotalScores,
        string Url,
        List<AnimeTitle> Titles
    );

}
