using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.Genre;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Services
{
    public class GenreService(IGenreRepository genres) : IGenreService
    {
        private readonly IGenreRepository _genres = genres;

        public async Task<Genre?> GetByIdAsync(int id) =>
            await GetGenreByIdAsync(id);

        public async Task<IEnumerable<Genre>> GetAllAsync() =>
            await _genres.GetAllAsync();

        public async Task<Genre> CreateAsync(CreateGenreRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.NameEn))
                throw new ArgumentNullException("English name cannot be empty");

            var genre = Genre.Create(request.NameEn, request.NameUa, request.NameRu);

            await _genres.AddAsync(genre);
            return genre;
        }

        public async Task<IEnumerable<Genre>> CreateManyAsync(IEnumerable<CreateGenreRequest> genresData)
        {
            var genres = genresData
                 .Select(g =>
                 {
                     if (string.IsNullOrWhiteSpace(g.NameEn))
                         throw new ArgumentNullException("English name cannot be empty");

                     return Genre.Create(g.NameEn, g.NameUa, g.NameRu);
                 })
                 .ToList();

            await _genres.AddRangeAsync(genres);
            return genres;
        }

        public async Task UpdateAsync(int id, UpdateGenreRequest request)
        {
            var genre = await GetGenreByIdAsync(id);

            if (request.NameEn != null)
                genre.ChangeNameEn(request.NameEn);

            if (request.NameUa != null)
                genre.ChangeNameUa(request.NameUa);

            if (request.NameRu != null)
                genre.ChangeNameRu(request.NameRu);

            await _genres.UpdateAsync(genre);
        }

        public async Task DeleteAsync(int id)
        {
            var genre = await GetGenreByIdAsync(id);
            await _genres.DeleteAsync(genre);
        }

        private async Task<Genre> GetGenreByIdAsync(int id)
        {
            var genre = await _genres.GetByIdAsync(id);
            if (genre is null)
                throw new NotFoundException("Genre", id);
            return genre;

        }
    }
}
