using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Dto.Responses.User;
using AnimeApp.Application.Exceptions;
using AnimeApp.Application.Mapping;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AutoMapper;
using System.Text.RegularExpressions;

namespace AnimeApp.Application.Services
{
    public class AnimeQueryService(
        IAnimeRepository animes,
        IUserAnimeRepository userAnimeService,
        IS3FileStorageService fileStorage,
        IMapper mapper) : IAnimeQueryService
    {
        private readonly IAnimeRepository _animeRep = animes;
        private readonly IUserAnimeRepository _userAnimeRep = userAnimeService;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly IMapper _mapper = mapper;

        /// <summary> Повертає аніме по ID </summary>
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

        /// <summary> Повертає рандомне аніме </summary>
        public async Task<AnimeResponse> GetRandomAsync()
        {
            var anime = await _animeRep.GetRandomAsync() ?? throw new NotFoundException("Anime");
            var response = _mapper.Map<AnimeResponse>(anime);

            response.PosterUrl = GetPosterUrl(anime.PosterFileName);
            response.ScreenshotsUrls = GetScreenshotsUrls(anime.ScreenshotsFileName);

            return response;
        }

        /// <summary> Повертає аніме за фільтром </summary>
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

            var response = new PagedResult<AnimesResponse>(
                items: mappedItems,
                totalCount: pagedResult.TotalCount,
                page: pagedResult.Page,
                pageSize: pagedResult.PageSize
            );
            return response;
        }

        /// <summary> Повертає аніме та зі статусом користувача якщо він є </summary>
        public async Task<AnimeUserResponse> GetAnimePageAsync(int animeId, int? userId)
        {
            // Тут колись була паралельність...
            var anime = await GetByIdAsync(animeId);
            UserAnimeStatus? userStatus = null;
            if (userId != null)
                userStatus = await GetUserAnimeStatusAsync(animeId, userId.Value);

            return new AnimeUserResponse(anime, userStatus);
        }

        /// <summary> Повертає масив айдішок всіх аніме </summary>
        public Task<List<int>> GetIdsAsync() => _animeRep.GetAllIdsAsync();


        // ============================== private methods ====================================


        /// <summary> Повертає сутність аніме по айді </summary>
        /// <exception cref="NotFoundException"></exception>
        private async Task<Anime> GetAnimeByIdAsync(int animeId) =>
            await _animeRep.GetByIdAsync(animeId) ?? throw new NotFoundException("Anime", animeId);

        /// <summary> Повертає статус користувача </summary>
        private async Task<UserAnimeStatus?> GetUserAnimeStatusAsync(int animeId, int userId)
        {
            var userAnime = await _userAnimeRep.GetUserAnimeStatusAsync(animeId, userId);
            return new(userAnime?.MyList, userAnime?.Rating, userAnime?.IsFavorite ?? false);
        }

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
