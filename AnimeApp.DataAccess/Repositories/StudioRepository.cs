using AnimeApp.Core.Contracts;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AnimeApp.DataAccess.Repositories
{
    // ===================== ANIME =====================
    public class StudioRepository(AnimeAppDbContext db) : IStudioRepository
    {
        private readonly AnimeAppDbContext _dbContext = db;

        public async Task<Studio?> GetByIdAsync(int id)
        {
            return await _dbContext.Studios
                .Include(s => s.Animes) // Всі аніме студії
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<PagedResult<Studio>> GetFilteredAsync(StudioFilter filter)
        {
            var query = _dbContext.Studios.AsQueryable();

            // =================== Пошук ===================
            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var term = filter.Search.Trim().ToLower();
                query = query.Where(s => s.Name.ToLower().Contains(term));
            }

            // =================== Сортування ===================
            query = filter.SortBy?.ToLower() switch
            {
                "name" => filter.SortDesc ? query.OrderByDescending(s => s.Name) : query.OrderBy(s => s.Name),
                _ => query.OrderBy(s => s.Id) // default
            };

            // =================== Пагінація ===================
            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResult<Studio>(items, totalCount, filter.Page, filter.PageSize);
        }

        public async Task AddAsync(Studio studio)
        {
            await _dbContext.Studios.AddAsync(studio);
            await _dbContext.SaveChangesAsync();
        }

        public async Task AddRangeAsync(IEnumerable<Studio> studios)
        {
            if (studios == null || !studios.Any()) return;

            await _dbContext.Studios.AddRangeAsync(studios);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Studio studio)
        {
            _dbContext.Studios.Update(studio);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Studio studio)
        {
            _dbContext.Studios.Remove(studio);
            await _dbContext.SaveChangesAsync();
        }
    }

}

