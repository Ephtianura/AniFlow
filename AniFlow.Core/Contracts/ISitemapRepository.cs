using AniFlow.Core.Dto;

namespace AniFlow.DataAccess.Repositories
{
    public interface ISitemapRepository
    {
        Task<List<AnimeSitemapRawResponse>> GetAllAnime();
    }
}