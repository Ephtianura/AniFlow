using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AnimeApp.DataAccess.Repositories
{
    // ===================== GENRE =====================
    public class GenreRepository(AnimeAppDbContext db) : IGenreRepository
    {
        private readonly AnimeAppDbContext _dbContext = db;

        public async Task<Genre?> GetByIdAsync(int id) =>
            await _dbContext.Genres
               .FirstOrDefaultAsync(a => a.Id == id);

        public async Task<List<Genre>> GetByIdsAsync(List<int> id) =>
            await _dbContext.Genres
               .Where(g => id.Contains(g.Id)).ToListAsync();

        public async Task<List<Genre>> GetBySlugsAsync(List<string> slugs) =>
            await _dbContext.Genres
               .Where(g => slugs.Contains(g.Slug)).ToListAsync();

        public async Task<List<Genre>> GetByNamesAsync(List<string> namesEn, List<string> namesUa) =>
            await _dbContext.Genres
               .Where(g => namesEn.Contains(g.NameEn) || (g.NameUa != null && namesUa.Contains(g.NameUa))).ToListAsync();
        public async Task<IEnumerable<Genre>> GetAllAsync() =>
                await _dbContext.Genres
                .AsNoTracking()
                .OrderBy(g => g.Type).ThenBy(g => g.NameUa)
                .ToListAsync();

        public async Task AddAsync(Genre genre)
        {
            await _dbContext.Genres.AddAsync(genre);
            await _dbContext.SaveChangesAsync();
        }
        public async Task AddRangeAsync(IEnumerable<Genre> genres)
        {
            if (genres == null || !genres.Any()) return;

            await _dbContext.Genres.AddRangeAsync(genres);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Genre genre)
        {
            _dbContext.Genres.Update(genre);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateRangeAsync(List<Genre> genre)
        {
            _dbContext.Genres.UpdateRange(genre);
            await _dbContext.SaveChangesAsync();
        }
        public async Task DeleteAsync(Genre genre)
        {
            _dbContext.Genres.Remove(genre);
            await _dbContext.SaveChangesAsync();
        }
    }
}

