using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;
using AnimeApp.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace GenreApp.DataAccess.Repositories
{
    // ===================== GENRE =====================
    public class GenreRepository(AnimeAppDbContext db) : IGenreRepository
    {
        private readonly AnimeAppDbContext _dbContext = db;

        public async Task<Genre?> GetByIdAsync(int id) => await _dbContext.Genres
               .FirstOrDefaultAsync(a => a.Id == id);

        public async Task<IEnumerable<Genre>> GetAllAsync()
        {
            return await _dbContext.Genres
                .AsNoTracking()
                .OrderBy(g => g.NameUa)
                .ToListAsync();
        }

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

        public async Task DeleteAsync(Genre genre)
        {
            _dbContext.Genres.Remove(genre);
            await _dbContext.SaveChangesAsync();
        }
    }
}

