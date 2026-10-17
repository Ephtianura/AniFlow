using AniFlow.Core.Models;

namespace AniFlow.Application.Dto.Responses.Anime
{
    public record AnimeCreateResponse(
            int Id,
            string Url,
            List<AnimeTitle> Titles
        );
}
