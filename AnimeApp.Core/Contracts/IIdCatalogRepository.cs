using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IIdCatalogRepository
    {
        Task<AnimeIdCatalog?> GetByIdsAsync(int? moonId = null, int? malId = null, int? kodikId = null);
        Task<List<AnimeIdCatalog>> GetByMoonIdsAsync(List<int> ids);
        Task AddAsync(AnimeIdCatalog catalog);
        Task AddRangeAsync(IEnumerable<AnimeIdCatalog> catalog);
        Task UpdateAsync(AnimeIdCatalog catalog);
        Task DeleteAsync(AnimeIdCatalog catalog);
        Task<IEnumerable<AnimeIdCatalog>> GetUnparsedIdsAsync();
        Task MarkUpdated(int moonId, DateTime datePublished);
        Task<List<AnimeIdCatalog>> GetAllByMalIds(List<int> malIds);
    }
}