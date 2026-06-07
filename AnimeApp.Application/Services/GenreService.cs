using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Dto.Requests.Genre;
using AnimeApp.Application.Exceptions;
using AnimeApp.Application.Helpers;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Services
{
    public class GenreService(IGenreRepository genres, IUnitOfWork unitOfWork) : IGenreService
    {
        private readonly IGenreRepository _genres = genres;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<Genre?> GetByIdAsync(int id) =>
            await GetGenreByIdAsync(id);

        public async Task<IEnumerable<Genre>> GetAllAsync() =>
            await _genres.GetAllAsync();

        public async Task<Genre> CreateAsync(CreateGenreRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.NameEn))
                throw new BadRequestException("English name cannot be empty");

            var genre = Genre.Create(
                nameEn: request.NameEn,
                slug: AniBuilder.GenerateSlug(request.NameEn),
                type: request.Type,
                nameUa: request.NameUa,
                nameRu: request.NameRu);

            await _genres.AddAsync(genre);
            return genre;
        }

        public async Task<IEnumerable<Genre>> CreateManyAsync(IEnumerable<CreateGenreRequest> genresData)
        {
            var genres = genresData
                 .Select(g =>
                 {
                     if (string.IsNullOrWhiteSpace(g.NameEn))
                         throw new BadRequestException("English name cannot be empty");

                     return Genre.Create(
                        nameEn: g.NameEn,
                        slug: g.NameEn.ToLowerInvariant(),
                        type: g.Type,
                        nameUa: g.NameUa,
                        nameRu: g.NameRu);
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
            if (request.Type != null)
                genre.ChangeType(request.Type.Value);
            if (request.Slug != null)
                genre.ChangeSlug(request.Slug);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var genre = await GetGenreByIdAsync(id);
            await _genres.DeleteAsync(genre);
        }

        private async Task<Genre> GetGenreByIdAsync(int id) =>
            await _genres.GetByIdAsync(id) ?? throw new NotFoundException("Genre", id);
    }
}
