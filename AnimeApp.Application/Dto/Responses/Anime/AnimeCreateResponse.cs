using AnimeApp.Core.Models;

namespace AnimeApp.Application.Dto.Responses.Anime
{
    public record AnimeCreateResponse(
            int Id,
            string Url,
            List<AnimeTitle> Titles
        );
}
