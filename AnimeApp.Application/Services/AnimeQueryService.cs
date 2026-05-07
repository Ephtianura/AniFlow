using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AutoMapper;

namespace AnimeApp.Application.Services
{
    public class AnimeQueryService(
        IAnimeRepository animes,
        IS3FileStorageService fileStorage,
        IMapper mapper) : IAnimeQueryService
    {
        private readonly IAnimeRepository _animeRep = animes;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly IMapper _mapper = mapper;

        public async Task<AnimeResponse> GetByIdAsync(int animeId)
        {
            var anime = await GetAnimeByIdAsync(animeId);

            var response = _mapper.Map<AnimeResponse>(anime);

            response.PosterUrl = GetPosterUrl(anime.PosterFileName);
            response.ScreenshotsUrls = GetScreenshotsUrls(anime.ScreenshotsFileName);

            if (response.Relateds != null)
            {
                foreach (var related in response.Relateds)
                {
                    var relatedAnime = anime.Relateds.FirstOrDefault(r => r.RelatedAnime.Id == related.Id)?.RelatedAnime;
                    if (relatedAnime != null && !string.IsNullOrWhiteSpace(relatedAnime.PosterFileName))
                        related.PosterUrl = _fileStorage.GetUrl(relatedAnime.PosterFileName);
                }
            }

            return response;
        }

        public async Task<AnimeResponse> GetRandomAsync()
        {
            var anime = await _animeRep.GetRandomAsync() ?? throw new NotFoundException("Anime");
            var response = _mapper.Map<AnimeResponse>(anime);

            response.PosterUrl = GetPosterUrl(anime.PosterFileName);
            response.ScreenshotsUrls = GetScreenshotsUrls(anime.ScreenshotsFileName);

            return response;
        }

        public async Task<PagedResult<AnimesResponse>> GetFilteredAsync(AnimeFilter filter)
        {
            var pagedResult = await _animeRep.GetFilteredAsync(filter);

            var mappedItems = pagedResult.Items.Select(anime =>
            {
                var animeDto = _mapper.Map<AnimesResponse>(anime);

                if (!string.IsNullOrWhiteSpace(anime.PosterFileName))
                    animeDto = animeDto with { PosterUrl = _fileStorage.GetUrl(anime.PosterFileName) };

                return animeDto;
            }).ToList();

            return new PagedResult<AnimesResponse>(
                items: mappedItems,
                totalCount: pagedResult.TotalCount,
                page: pagedResult.Page,
                pageSize: pagedResult.PageSize
            );
        }

        public Task<List<int>> GetIdsAsync() => _animeRep.GetRandomIdsAsync();


        // ============================== private methods ====================================

        /// <summary> Повертає сутність аніме по айді </summary>
        /// <exception cref="NotFoundException"></exception>
        private async Task<Anime> GetAnimeByIdAsync(int animeId) =>
            await _animeRep.GetByIdAsync(animeId) ?? throw new NotFoundException("Anime", animeId);

        private string? GetPosterUrl(string? posterFileName) =>
            string.IsNullOrWhiteSpace(posterFileName)
                ? null
                : _fileStorage.GetUrl(posterFileName);

        private List<string>? GetScreenshotsUrls(List<string>? screenshotsFileNames) =>
            screenshotsFileNames?.Any() == true
                ? screenshotsFileNames.ConvertAll(_fileStorage.GetUrl)
                : null;
    }
}
