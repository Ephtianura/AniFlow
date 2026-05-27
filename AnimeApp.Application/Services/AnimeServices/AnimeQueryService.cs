using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.External;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Exceptions;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AutoMapper;
using Microsoft.Extensions.Logging;

namespace AnimeApp.Application.Services.AnimeServices
{
    public class AnimeQueryService(
        IAnimeRepository animes,
        IS3FileStorageService fileStorage,
        IMoonApiClient moonApi,
        IMapper mapper,
        ILogger<AnimeQueryService> logger) : IAnimeQueryService
    {
        private readonly IAnimeRepository _animeRep = animes;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly IMoonApiClient _moonApi = moonApi;
        private readonly IMapper _mapper = mapper;
        private readonly ILogger<AnimeQueryService> _logger = logger;

        public async Task<AnimeResponse> GetByIdAsync(int animeId)
        {
            //_logger.LogWarning("Тест логування");

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

            var mappedItems = pagedResult.Items.Select(a =>
            {
                var animeDto = _mapper.Map<AnimesResponse>(a);

                if (!string.IsNullOrWhiteSpace(a.PosterFileName))
                    animeDto.PosterUrl = _fileStorage.GetUrl(a.PosterFileName);

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

            // Moon
            List<VoiceEpisodeSet> moon = [];
            try
            {
                moon = await _moonApi.GetEpisodes(malId);
            }
            catch (ExternalApiException ex)
            {
                _logger.LogWarning(ex, "MoonApi не повернув епізоди. MalId: {MalId}", malId);
            }
            var moonSorded = NormalizeEpisodes(moon);
            result.Add(new PlayerEpisodeSet(
                AnimePlayer.Moon, moonSorded));

            // Kodik
            //var kodik = await _kodikApi.GetEpisodes(malId);
            //result.Add(new PlayerEpisodeSet(AnimePlayer.Kodik, kodik));

            return result;
        }

        public Task<List<int>> GetIdsAsync() => _animeRep.GetAllMixedIdsAsync();

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


        private List<VoiceEpisodeSet> NormalizeEpisodes(List<VoiceEpisodeSet> episodes)
        {
            foreach (var voiceSet in episodes)
            {
                FixNullEpisodes(voiceSet);
            }

            var moonSorted = episodes
            .OrderByDescending(x =>
                (x.Episodes.Count * 100) +
                (x.Episodes.Any(e => e.Subtitles) ? 10 : 0) -
                (x.Voice.Contains("sub", StringComparison.OrdinalIgnoreCase) ||
                (x.Voice.Contains("суб", StringComparison.OrdinalIgnoreCase)) ? 50 : 0))
                .ToList();

            return moonSorted;
        }
        private void FixNullEpisodes(VoiceEpisodeSet voiceSet)
        {
            var nullEpisodes = voiceSet.Episodes
                .Where(e => e.Episode == null)
                .ToList();

            if (nullEpisodes.Count == 0)
                return;

            var takenEpisodes = voiceSet.Episodes
                .Where(e => e.Episode != null)
                .Select(e => e.Episode!.Value)
                .ToHashSet();

            int nextCandidate = takenEpisodes.Count > 0 ? takenEpisodes.Max() + 1 : 1;

            foreach (var nullEpisode in nullEpisodes)
            {
                //int candidate = 69;
                //while (takenEpisodes.Contains(candidate))
                //    candidate += 100;

                int candidate = nextCandidate;
                while (takenEpisodes.Contains(candidate))
                    candidate++;

                takenEpisodes.Add(candidate);

                int index = voiceSet.Episodes.IndexOf(nullEpisode);
                if (index != -1)
                {
                    voiceSet.Episodes[index] =
                        nullEpisode with { Episode = candidate };
                }
            }
        }

    }
}
