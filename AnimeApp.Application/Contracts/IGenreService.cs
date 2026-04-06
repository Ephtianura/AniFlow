using AnimeApp.Application.Dto.Requests.Genre;
using AnimeApp.Application.Services;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Contracts
{
    public interface IGenreService
    {
        Task<Genre> CreateAsync(CreateGenreRequest request);
        Task<IEnumerable<Genre>> CreateManyAsync(IEnumerable<CreateGenreRequest> genresData);
        Task DeleteAsync(int id);
        Task<IEnumerable<Genre>> GetAllAsync();
        Task<Genre?> GetByIdAsync(int id);
        Task UpdateAsync(int id, UpdateGenreRequest request);
    }
}