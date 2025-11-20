using AnimeApp.Application.Services;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts
{
    public interface IGenreService
    {
        Task<Genre> CreateAsync(GenreService.CreateGenreRequest request);
        Task<IEnumerable<Genre>> CreateManyAsync(IEnumerable<GenreService.CreateGenreRequest> genresData);
        Task DeleteAsync(int id);
        Task<IEnumerable<Genre>> GetAllAsync();
        Task<Genre?> GetByIdAsync(int id);
        Task UpdateAsync(int id, GenreService.UpdateGenreRequest request);
    }
}