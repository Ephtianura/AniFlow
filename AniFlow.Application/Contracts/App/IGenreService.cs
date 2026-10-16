using AniFlow.Application.Dto.Requests.Genre;
using AniFlow.Application.Services;
using AniFlow.Core.Models;

namespace AniFlow.Application.Contracts.App
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