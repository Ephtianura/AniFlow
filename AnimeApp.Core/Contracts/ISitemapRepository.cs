using AnimeApp.Core.Dto;

namespace AnimeApp.DataAccess.Repositories
{
    public interface ISitemapRepository
    {
        Task<List<AnimeSitemapRawResponse>> GetAllAnime();
    }
}