using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.External;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AutoMapper;

namespace AnimeApp.Application.Services.AnimeServices
{
    public class AnimeQueryService(
        IAnimeRepository animes,
        IS3FileStorageService fileStorage,
        IMoonApiClient moonApi,
        IMapper mapper) : IAnimeQueryService
    {
        private readonly IAnimeRepository _animeRep = animes;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly IMoonApiClient _moonApi = moonApi;
        private readonly IMapper _mapper = mapper;

        public async Task<AnimeResponse> GetByIdAsync(int animeId)
        {
            var anime = await GetAnimeByIdAsync(animeId);

            anime.Promos = anime.Promos.Where(p => p.AnimeOstId == null).ToList();

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

        public async Task<List<PlayerEpisodeSet>> GetEpisodes(int malId)
        {
            List<PlayerEpisodeSet> result = [];

            var moon = await _moonApi.GetEpisodes(malId);
            result.Add(new PlayerEpisodeSet(AnimePlayer.Moon, moon));

            //var kodik = await _kodikApi.GetEpisodes(malId);
            //result.Add(new PlayerEpisodeSet(AnimePlayer.Kodik, kodik));

            return result;
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
