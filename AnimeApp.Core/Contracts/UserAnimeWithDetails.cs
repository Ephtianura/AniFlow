using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
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
