using AnimeApp.Core.Models;

namespace AnimeApp.Core.Contracts
{
    public interface IGenreRepository
    {
        Task AddAsync(Genre genre);
        Task AddRangeAsync(IEnumerable<Genre> genres);
        Task DeleteAsync(Genre genre);
        Task<IEnumerable<Genre>> GetAllAsync();
        Task<Genre?> GetByIdAsync(int id);
        Task UpdateAsync(Genre genre);
    }
}