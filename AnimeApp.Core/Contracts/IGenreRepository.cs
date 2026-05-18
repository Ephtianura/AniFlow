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
        Task<List<Genre>> GetBySlugsAsync(List<string> slugs);
        Task UpdateRangeAsync(List<Genre> genre);
        Task<List<Genre>> GetByIdsAsync(List<int> id);
        Task<List<Genre>> GetByNamesAsync(List<string> namesEn, List<string> namesUa);
    }
}