using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AnimeApp.DataAccess.Repositories
{
    public class IdCatalogRepository(AnimeAppDbContext db) : IIdCatalogRepository
    {
        private readonly AnimeAppDbContext _dbContext = db;

        public async Task<AnimeIdCatalog?> GetByIdsAsync(int? moonId = null, int? malId = null, int? kodikId = null)
        {
            if (moonId == null && malId == null && kodikId == null) return null;

            return await _dbContext.AnimeIdCatalog
                .FirstOrDefaultAsync(a =>
                    (moonId != null && a.MoonId == moonId) ||
                    (malId != null && a.MalId == malId) ||
                    (kodikId != null && a.KodikId == kodikId));
        }

        public async Task MarkUpdated(int moonId, DateTime datePublished)
        {
            await _dbContext.AnimeIdCatalog
                .Where(x => x.MoonId == moonId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.LastUpdated, datePublished));
        }

        public async Task<List<AnimeIdCatalog>> GetAllByMalIds(List<int> malIds) =>
            await _dbContext.AnimeIdCatalog
                .Where(x => malIds.Contains(x.MalId))
                .ToListAsync();

        public async Task<List<AnimeIdCatalog>> GetByMoonIdsAsync(List<int> moonIds)
        {
            if (moonIds == null || moonIds.Count == 0)
                return [];
            return await _dbContext.AnimeIdCatalog
                .Where(x => moonIds.Contains(x.MoonId))
                .ToListAsync();
        }

        public async Task<IEnumerable<AnimeIdCatalog>> GetUnparsedIdsAsync() =>
                await _dbContext.AnimeIdCatalog
                .Where(i => !i.IsParsed)
                .OrderBy(i => i.MoonId)
                .ToListAsync();

        public async Task AddAsync(AnimeIdCatalog catalog)
        {
            await _dbContext.AnimeIdCatalog.AddAsync(catalog);
            await _dbContext.SaveChangesAsync();
        }
        public async Task AddRangeAsync(IEnumerable<AnimeIdCatalog> catalog)
        {
            if (catalog?.Any() != true) return;
            await _dbContext.AnimeIdCatalog.AddRangeAsync(catalog);
            await _dbContext.SaveChangesAsync();
        }
        public async Task UpdateAsync(AnimeIdCatalog catalog)
        {
            _dbContext.AnimeIdCatalog.Update(catalog);
            await _dbContext.SaveChangesAsync();
        }
        public async Task DeleteAsync(AnimeIdCatalog catalog)
        {
            _dbContext.AnimeIdCatalog.Remove(catalog);
            await _dbContext.SaveChangesAsync();
        }

        
    }
}
