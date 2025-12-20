using AnimeApp.Application.Contracts;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Exceptions;
using AnimeApp.Application.Mapping;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Filters;
using AnimeApp.Core.Models;
using AutoMapper;
using System.Xml.Linq;

namespace AnimeApp.Application.Services
{
    public class AnimeService(
        IAnimeRepository animes,
        IStudioRepository studios,
        IGenreRepository genres,
        IS3FileStorageService fileStorage,
        IMapper mapper,
        IS3FileStorageService fileUrl) : IAnimeService

    {
        private readonly IAnimeRepository _animes = animes;
        private readonly IStudioRepository _studios = studios;
        private readonly IGenreRepository _genres = genres;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly IMapper _mapper = mapper;
        private readonly IS3FileStorageService _fileUrl = fileUrl;

       

        // Отримати аніме по ID
        public async Task<AnimeResponse> GetByIdAsync(int id)
        {
            var anime = await GetAnimeByIdAsync(id);

            var response = _mapper.Map<AnimeResponse>(anime);

            response.PosterUrl = GetPosterUrl(anime.PosterFileName);
            response.ScreenshotsUrls = GetScreenshotsUrls(anime.ScreenshotsFileName);

            if (response.Relateds != null)
            {
                foreach (var related in response.Relateds)
                {
                    var relatedAnime = anime.Relateds.FirstOrDefault(r => r.RelatedAnime.Id == related.Id)?.RelatedAnime;
                    if (relatedAnime != null && !string.IsNullOrWhiteSpace(relatedAnime.PosterFileName))
                        related.PosterUrl = _fileUrl.GetUrl(relatedAnime.PosterFileName);
                }
            }

            return response;
        }

        // Отримати рандомне аніме
        public async Task<AnimeResponse> GetRandomAsync()
        {
            var anime = await _animes.GetRandomAsync() ?? throw new EntityNotFoundException("Anime");
            var response = _mapper.Map<AnimeResponse>(anime);

            response.PosterUrl = GetPosterUrl(anime.PosterFileName);
            response.ScreenshotsUrls = GetScreenshotsUrls(anime.ScreenshotsFileName);

            return response;
        }

        // Отримати аніме за фільтром
        public async Task<PagedResult<AnimesResponse>> GetFilteredAsync(AnimeFilter filter)
        {
            var pagedResult = await _animes.GetFilteredAsync(filter);

            var mappedItems = pagedResult.Items.Select(anime =>
            {
                var animeDto = _mapper.Map<AnimesResponse>(anime);

                if (!string.IsNullOrWhiteSpace(anime.PosterFileName))
                    animeDto = animeDto with { PosterUrl = _fileUrl.GetUrl(anime.PosterFileName) };

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

        // Створити аніме
        public async Task<AnimeResponse> CreateAsync(AnimeCreateRequest request)
        {
            // Валідуємо, що є хоча б один Romaji
            if (!request.Titles.Any(t => t.Language == TitleLanguage.Romaji))
                throw new ArgumentException("Anime must have at least one title in Romaji.");

            // ===================== Studio =====================
            Studio? studio = null;
            if (request.StudiosId.HasValue)
            {
                studio = await _studios.GetByIdAsync(request.StudiosId.Value);
                if (studio == null)
                    throw new InvalidOperationException("Studio not found");
            }

            // ===================== Genres =====================
            List<Genre>? genres = null;
            if (request.GenresId != null && request.GenresId.Any())
            {
                genres = new List<Genre>();
                foreach (var genreId in request.GenresId)
                {
                    var genre = await _genres.GetByIdAsync(genreId);
                    if (genre != null) genres.Add(genre);
                }
            }

            // Створити назви
            var titles = request.Titles
                .Select(t => AnimeTitle.Create(t.Value, t.Language, t.Type))
                .ToList();

            // Генерація URL з офіційного Romaji title
            var officialRomajiTitle = titles
                .FirstOrDefault(t => t.Type == TitleType.Official && t.Language == TitleLanguage.Romaji);
            if (officialRomajiTitle == null)
                throw new InvalidOperationException("Anime must have at least one official title in Romaji to generate URL.");
            var url = officialRomajiTitle.Value
                .Trim()
                .ToLower()
                .Replace(" ", "-");

            DateTime? airedOnUtc = request.AiredOn?.ToUniversalTime();
            DateTime? releasedOnUtc = request.ReleasedOn?.ToUniversalTime();

            var airedOn = request.AiredOn;

            SeasonEnum season = SeasonEnum.Unknown;
            int year = 0;

            if (airedOn.HasValue)
            {
                year = airedOn.Value.Year;
                season = GetSeasonFromDate(airedOn.Value);
            }

            // ===================== Create Anime =====================
            var anime = Anime.Create(
                titles: titles,
                url: url,
                kind: request.Kind,
                status: request.Status,
                rating: request.Rating,
                description: request.Description,
                studio: studio,
                genres: genres,
                airedOn: airedOnUtc,
                releasedOn: releasedOnUtc,
                season: season,
                year: year,
                score: request.Score,
                episodes: request.Episodes,
                episodesAired: request.EpisodesAired,
                duration: request.Duration
            );

            await _animes.AddAsync(anime);

            anime.UpdateUrl($"{url}-{anime.Id}");

            await _animes.UpdateAsync(anime);


            var response = _mapper.Map<AnimeResponse>(anime);

            response.PosterUrl = GetPosterUrl(anime.PosterFileName);
            response.ScreenshotsUrls = GetScreenshotsUrls(anime.ScreenshotsFileName);

            return response;
        }

        // Оновити файли аніме
        public async Task<AnimeResponse> UpdateFilesAsync(int id, AnimeUpdateFilesRequest request)
        {
            var anime = await GetAnimeByIdAsync(id);

            // ===================== Оновлення постера =====================
            if (request.Poster != null)
            {
                using var stream = request.Poster.OpenReadStream();
                var posterFileName = await _fileStorage.UploadFileAsync(stream, request.Poster.FileName, "anime-posters");
                anime.UpdatePosterFileName(posterFileName);
            }
            else if (!string.IsNullOrWhiteSpace(request.PosterUrl))
            {
                try
                {
                    using var http = new HttpClient();
                    var response = await http.GetAsync(request.PosterUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        var bytes = await response.Content.ReadAsByteArrayAsync();
                        var ext = response.Content.Headers.ContentType?.MediaType switch
                        {
                            "image/png" => ".png",
                            "image/webp" => ".webp",
                            _ => ".jpg"
                        };

                        var fileName = $"{Guid.NewGuid()}{ext}";
                        using var ms = new MemoryStream(bytes);
                        var saved = await _fileStorage.UploadFileAsync(ms, fileName, "anime-posters");
                        anime.UpdatePosterFileName(saved);
                    }
                }
                catch
                {
                }
            }

            // ===================== Оновлення скриншотів =====================
            var screenshotFiles = new List<string>();

            // Файли
            if (request.Screenshots != null && request.Screenshots.Any())
            {
                foreach (var file in request.Screenshots)
                {
                    if (file.Length == 0) continue;

                    using var stream = file.OpenReadStream();
                    var uploadedFile = await _fileStorage.UploadFileAsync(stream, file.FileName, "anime-screenshots");
                    screenshotFiles.Add(uploadedFile);
                }
            }

            // Скріншоти по URL
            if (request.ScreenshotUrls != null && request.ScreenshotUrls.Any())
            {
                foreach (var url in request.ScreenshotUrls)
                {
                    try
                    {
                        using var http = new HttpClient();
                        var response = await http.GetAsync(url);
                        if (!response.IsSuccessStatusCode) continue;

                        var bytes = await response.Content.ReadAsByteArrayAsync();
                        var ext = response.Content.Headers.ContentType?.MediaType switch
                        {
                            "image/png" => ".png",
                            "image/webp" => ".webp",
                            _ => ".jpg"
                        };

                        var fileName = $"{Guid.NewGuid()}{ext}";
                        using var ms = new MemoryStream(bytes);
                        var saved = await _fileStorage.UploadFileAsync(ms, fileName, "anime-screenshots");
                        screenshotFiles.Add(saved);
                    }
                    catch
                    {
                    }
                }
            }

            if (screenshotFiles.Any())
                anime.UpdateScreenshotsFileName(screenshotFiles);

            if ((request.Poster == null && string.IsNullOrWhiteSpace(request.PosterUrl)) &&
                ((request.Screenshots == null || !request.Screenshots.Any()) &&
                 (request.ScreenshotUrls == null || !request.ScreenshotUrls.Any())))
            {
                throw new ArgumentException("Необхідно завантажити хоча б постер чи один скріншот.");
            }

            await _animes.UpdateAsync(anime);

            var animeResponse = _mapper.Map<AnimeResponse>(anime);

            animeResponse.PosterUrl = GetPosterUrl(anime.PosterFileName);
            animeResponse.ScreenshotsUrls = GetScreenshotsUrls(anime.ScreenshotsFileName);

            return animeResponse;
        }


        // Оновити аніме
        public async Task<AnimeResponse> UpdateAsync(int id, AnimeUpdateRequest request)
        {
            var anime = await GetAnimeByIdAsync(id);

            // ===================== Studio =====================
            if (request.StudiosId.HasValue && request.StudiosId.Value != anime.StudiosId)
            {
                var studio = await _studios.GetByIdAsync(request.StudiosId.Value)
                    ?? throw new EntityNotFoundException("Studio", id);
                anime.SetStudio(studio);
            }

            // ===================== Genres =====================
            if (request.GenresId != null)
            {
                var genres = new List<Genre>();
                foreach (var genreId in request.GenresId)
                {
                    var genre = await _genres.GetByIdAsync(genreId);
                    if (genre != null) genres.Add(genre);
                }

                // Оновити жанри
                anime.Genres.Clear();
                foreach (var g in genres)
                    anime.AddGenre(g);
            }

            // ===================== Titles =====================
            if (request.Titles != null && request.Titles.Any())
            {
                anime.Titles.Clear();
                foreach (var t in request.Titles)
                {
                    anime.AddTitle(AnimeTitle.Create(t.Value, t.Language, t.Type));
                }

                // Оновлюємо URL, якщо є Romaji
                var officialRomaji = anime.Titles.FirstOrDefault(t => t.Type == TitleType.Official && t.Language == TitleLanguage.Romaji);
                if (officialRomaji != null)
                {
                    var url = officialRomaji.Value.Trim().ToLower().Replace(" ", "-");
                    anime.UpdateUrl($"{url}-{anime.Id}");
                }
            }
            // ===================== Relateds =====================
            if (request.RelatedsAnimes != null)
            {
                var newRelations = request.RelatedsAnimes;

                // 1. Видаляємо старі зв'язки, яких немає у новому списку
                var existingIds = anime.Relateds.Select(r => r.RelatedAnimeId).ToList();
                var newIds = newRelations.Select(r => r.RelatedAnimeId).ToList();

                var toRemove = existingIds.Except(newIds).ToList();

                foreach (var relatedId in toRemove)
                {
                    anime.RemoveRelated(relatedId);

                    // Двостороннє видалення (якщо було)
                    var relatedAnime = await GetAnimeByIdAsync(relatedId);
                    relatedAnime.RemoveRelated(anime.Id);
                }

                // 2. Додаємо нові зв'язки (або оновлюємо старі)
                foreach (var rel in newRelations)
                {
                    var relatedAnime = await GetAnimeByIdAsync(rel.RelatedAnimeId);

                    // Прямий зв'язок
                    anime.AddRelated(relatedAnime, rel.RelationKind);

                    // Зворотний зв'язок, якщо є мапінг
                    var reverse = RelationKindMap.GetReverse(rel.RelationKind);
                    if (reverse != null)
                    {
                        relatedAnime.AddRelated(anime, reverse.Value);
                    }
                }
            }
            else
            {
                //Якщо налл не чипати 
            }

            // ===================== Інші =====================
            if (!string.IsNullOrWhiteSpace(request.Description) && request.Description != anime.Description)
                anime.UpdateDescription(request.Description);

            if (request.AiredOn.HasValue && request.AiredOn != anime.AiredOn)
            {
                DateTime? airedOnUtc = request.AiredOn?.ToUniversalTime();
                anime.UpdateAiredOn(airedOnUtc);
            }
            if (request.ReleasedOn.HasValue && request.ReleasedOn != anime.ReleasedOn)
            {
                DateTime? releasedOnUtc = request.ReleasedOn?.ToUniversalTime();
                anime.UpdateReleasedOn(releasedOnUtc);
            }

            if (request.Kind.HasValue && request.Kind != anime.Kind)
                anime.UpdateKind(request.Kind.Value);
            if (request.Status.HasValue && request.Status != anime.Status)
                anime.UpdateStatus(request.Status.Value);
            if (request.Rating.HasValue && request.Rating != anime.Rating)
                anime.UpdateRating(request.Rating.Value);

            if (request.Season.HasValue && request.Season != anime.Season)
            {
                anime.UpdateSeason(request.Season.Value);
            }
            if (request.Year.HasValue && request.Year != anime.Year)
            {
                anime.UpdateYear(request.Year.Value);
            }

            if (request.Score.HasValue && request.Score != anime.Score)
                anime.UpdateScore(request.Score.Value);

            if (request.Episodes.HasValue && request.Episodes != anime.Episodes)
                anime.UpdateEpisodes(request.Episodes.Value);
            if (request.EpisodesAired.HasValue && request.EpisodesAired != anime.EpisodesAired)
                anime.UpdateEpisodesAired(request.EpisodesAired.Value);

            if (request.Duration.HasValue && request.Duration != anime.Duration)
                anime.UpdateDuration(request.Duration.Value);

            await _animes.UpdateAsync(anime);

            var response = _mapper.Map<AnimeResponse>(anime);

            response.PosterUrl = GetPosterUrl(anime.PosterFileName);
            response.ScreenshotsUrls = GetScreenshotsUrls(anime.ScreenshotsFileName);

            return response;
        }


        // Видалити аніме
        public async Task DeleteAsync(int id)
        {
            var anime = await GetAnimeByIdAsync(id);
            await _animes.DeleteAsync(anime);
        }

        private async Task<Anime> GetAnimeByIdAsync(int id) =>
            await _animes.GetByIdAsync(id) ?? throw new EntityNotFoundException("Anime", id);

        private SeasonEnum GetSeasonFromDate(DateTime date)
        {
            return date.Month switch
            {
                12 or 1 or 2 => SeasonEnum.Winter,
                3 or 4 or 5 => SeasonEnum.Spring,
                6 or 7 or 8 => SeasonEnum.Summer,
                9 or 10 or 11 => SeasonEnum.Fall,
                _ => SeasonEnum.Unknown
            };
        }

        private string? GetPosterUrl(string? posterFileName)
        {
            return string.IsNullOrWhiteSpace(posterFileName)
                ? null
                : _fileUrl.GetUrl(posterFileName);
        }

        private List<string>? GetScreenshotsUrls(List<string>? screenshotsFileNames)
        {
            return screenshotsFileNames?.Any() == true
                ? screenshotsFileNames
                    .Select(_fileUrl.GetUrl)
                    .ToList()
                : null;
        }

        public Task<List<int>> GetIdsAsync() => _animes.GetAllIdsAsync();
    }
}
