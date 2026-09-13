using AnimeApp.Application.Dto.Responses.Anime;

namespace AnimeApp.Application.Contracts.App
{
    public interface ISitemapService
    {
        Task<List<AnimeSitemapResponse>> GetAllAnime();
    }
}