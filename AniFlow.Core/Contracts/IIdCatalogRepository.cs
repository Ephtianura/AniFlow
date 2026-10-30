using AniFlow.Core.Models;

namespace AniFlow.Core.Contracts
{
    public interface IIdCatalogRepository
    {
        Task<AnimeIdCatalog?> GetByIdsAsync(int? moonId = null, int? malId = null, string? kodikId = null);
        Task<List<AnimeIdCatalog>> GetByMoonIdsAsync(List<int> ids);
        void Add(AnimeIdCatalog catalog);
        Task AddRangeAsync(IEnumerable<AnimeIdCatalog> catalog);
        void Update(AnimeIdCatalog catalog);
        void Delete(AnimeIdCatalog catalog);
        Task<IEnumerable<AnimeIdCatalog>> GetUnparsedIdsAsync();
        Task MarkUpdated(int moonId, DateTime datePublished);
        Task<List<AnimeIdCatalog>> GetAllByMalIds(List<int> malIds);
    }
}