using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.External;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Services.Importing
{
    public class GengesFactory(IGenreRepository genreRep, IMoonApiClient moonApi) : IGengesFactory
    {
        private readonly IGenreRepository _genreRep = genreRep;
        private readonly IMoonApiClient _moonApi = moonApi;

        public async Task<List<Genre>> GetGenresFromRaw(List<GenreRawDto> raw)
        {
            var slugs = raw
                .Where(r => r.Slug != null)
                .Select(r => r.Slug!).ToList();
            return await _genreRep.GetBySlugsAsync(slugs);
        }

        public async Task<CreateUpdateResult> ImportGenres()
        {
            var rawGenres = await _moonApi.GetAllTags();
            return await ImportGenresFromRaw(rawGenres);
        }

        public async Task<CreateUpdateResult> ImportGenresFromRaw(TagsDto raw)
        {
            var genres = await BuildGenresFromRaw(raw);
            var exists = await _genreRep.GetByNamesAsync(
                genres.ConvertAll(g => g.NameEn), 
                genres.Select(g => g.NameUa).OfType<string>().ToList());

            var genresByName = genres.ToDictionary(g => g.NameEn);

            var result = new CreateUpdateResult();

            foreach (var exist in exists)
            {
                if (!genresByName.TryGetValue(exist.NameEn, out var genre))
                    continue;

                if (string.IsNullOrWhiteSpace(exist.Slug))
                {
                    exist.ChangeSlug(genre.Slug);
                    exist.ChangeType(genre.Type);
                    result.Updated++;
                }

                genres.Remove(genre);
            }

            await _genreRep.UpdateRangeAsync(exists);

            if (genres.Count > 0)
                await _genreRep.AddRangeAsync(genres);

            result.Created = genres.Count;
            return result;
        }

       

        public async Task<List<Genre>> BuildGenresFromRaw(TagsDto raw)
        {
            List<Genre> genres = [];

            void Add(IEnumerable<TagDto> tag, TagType type) =>
                genres.AddRange(tag.Select(g =>
                    Genre.Create(g.NameEn, g.Slug, type, g.NameUa)));

            Add(raw.Genres, TagType.Genre);
            Add(raw.Themes, TagType.Theme);
            Add(raw.Demographics, TagType.Demographic);

            return genres;
        }

    }
}
