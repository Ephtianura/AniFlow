using AniFlow.Application.Dto.Responses.Anime;

namespace AniFlow.Application.Contracts.App
{
    public interface ISitemapService
    {
        Task<List<AnimeSitemapResponse>> GetAllAnime();
    }
}