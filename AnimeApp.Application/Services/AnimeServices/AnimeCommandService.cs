using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Exceptions;
using AnimeApp.Application.Helpers;
using AnimeApp.Application.Mapping;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;

namespace AnimeApp.Application.Services.AnimeServices
{
    public class AnimeCommandService(
        IAnimeRepository animes,
        IUnitOfWork unitOfWork,
        IStudioRepository studios,
        IGenreRepository genres,
        IS3FileStorageService fileStorage
        ) : IAnimeCommandService
    {
        private readonly IAnimeRepository _animeRep = animes;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IStudioRepository _studios = studios;
        private readonly IGenreRepository _genres = genres;
        private readonly IS3FileStorageService _fileStorage = fileStorage;

        public async Task<AnimeCreateResponse> CreateAsync(AnimeCreateRequest request)
        {
            // Створити назви
            var titles = request.Titles
                .ConvertAll(t => AnimeTitle.Create(t.Value, t.Language, t.Type))
;
            // Валідація на хоча б одну офіційну ромаджі назву
            var officialRomajiTitle = titles
                .FirstOrDefault(t => t.Type == TitleType.Official && t.Language == TitleLanguage.Romaji)
                    ?? throw new ArgumentException("Anime must have at least one official title in Romaji.");

            // ===================== Studio =====================
            Studio? studio = null;
            if (request.StudiosId.HasValue)
            {
                studio = await _studios.GetByIdAsync(request.StudiosId.Value);
                if (studio == null)
                    throw new NotFoundException("Studio", request.StudiosId.Value);
            }

            // ===================== Genres =====================
            List<Genre>? genres = null;
            if (request.GenresIds?.Any() == true)
            {
                genres = [];
                genres = await _genres.GetByIdsAsync(request.GenresIds);
                genres?.AddRange(genres);
            }

            var airedOn = request.AiredOn;

            DateTime? airedOnUtc = airedOn?.ToUniversalTime();
            DateTime? releasedOnUtc = request.ReleasedOn?.ToUniversalTime();

            SeasonEnum? season = null;
            int year = 0;

            if (airedOn.HasValue)
            {
                year = airedOn.Value.Year;
                season = AniBuilder.SeasonFromDateMapper(airedOn.Value);
            }

            // ===================== Create Anime =====================
            var anime = Anime.Create(new CreateAnimeParams
            {
                Titles = titles,
                Url = "unknown",
                Kind = request.Kind,
                Status = request.Status,
                Rating = request.Rating,
                Description = request.Description,
                Studio = studio,
                Genres = genres,
                AiredOn = airedOnUtc,
                ReleasedOn = releasedOnUtc,
                Season = season,
                Year = year,
                Score = request.Score,
                Episodes = request.Episodes,
                EpisodesAired = request.EpisodesAired,
                Duration = request.Duration
            });

            await _animeRep.AddAsync(anime);
            await _unitOfWork.SaveChangesAsync();
            // Генерація URL з офіційного Romaji title
            anime.UpdateUrl(AniBuilder.GenerateSlug(officialRomajiTitle.Value, anime.Id));

            await _animeRep.UpdateAsync(anime);
            await _unitOfWork.SaveChangesAsync();
            return new AnimeCreateResponse(
                anime.Id,
                anime.Url,
                anime.Titles
            );
        }

        public async Task UpdateAsync(int id, AnimeUpdateRequest request)
        {
            var anime = await GetAnimeByIdAsync(id);

            // ===================== Studio =====================
            if (request.StudiosId.HasValue && request.StudiosId.Value != anime.StudiosId)
            {
                var studio = await _studios.GetByIdAsync(request.StudiosId.Value)
                    ?? throw new NotFoundException("Studio", request.StudiosId.Value);
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
                var officialRomaji = anime.Titles
                    .FirstOrDefault(t => t.Type == TitleType.Official && t.Language == TitleLanguage.Romaji);
                if (officialRomaji != null)
                {
                    var url = AniBuilder.GenerateSlug(officialRomaji.Value, anime.Id);
                    anime.UpdateUrl(url);
                }
            }

            // !!!------------------ Потребує рефакторінгу... ------------------!!!

            // ===================== Relateds =====================
            if (request.RelatedsAnimes != null)
            {
                var newRelations = request.RelatedsAnimes;

                // 1. Видаляємо старі зв'язки, яких немає у новому списку
                var existingIds = anime.Relateds.ConvertAll(r => r.RelatedAnimeId);
                var newIds = newRelations.ConvertAll(r => r.RelatedAnimeId);

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

            if (request.AiredOn.HasValue)
            {
                anime.UpdateYear(request.AiredOn.Value.Year);
                anime.UpdateSeason(AniBuilder.SeasonFromDateMapper(request.AiredOn.Value));
            }

            if (request.Score.HasValue && request.Score != anime.Score)
                anime.Rate(request.Score.Value);

            if (request.Episodes.HasValue && request.Episodes != anime.Episodes)
                anime.UpdateEpisodes(request.Episodes.Value);
            if (request.EpisodesAired.HasValue && request.EpisodesAired != anime.EpisodesAired)
                anime.UpdateEpisodesAired(request.EpisodesAired.Value);

            if (request.Duration.HasValue && request.Duration != anime.Duration)
                anime.UpdateDuration(request.Duration.Value);

            await _animeRep.UpdateAsync(anime);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateFilesAsync(int id, AnimeUpdateFilesRequest request)
        {
            if (request.Poster == null && string.IsNullOrWhiteSpace(request.PosterUrl) &&
               (request.Screenshots == null || !request.Screenshots.Any()) &&
                (request.ScreenshotUrls == null || !request.ScreenshotUrls.Any()))
                throw new ArgumentException("Необхідно завантажити хоча б постер чи один скріншот.");

            var anime = await GetAnimeByIdAsync(id);

            // ===================== Оновлення постера =====================
            if (request.Poster != null)
            {
                using var stream = request.Poster.OpenReadStream();
                var posterFileName = await _fileStorage.UploadFileAsync(stream, request.Poster.FileName, StoragePaths.AnimePosters);
                anime.UpdatePosterFileName(posterFileName);
            }
            else if (!string.IsNullOrWhiteSpace(request.PosterUrl))
            {
                var saved = await _fileStorage.UploadImageFromUrlAsync(request.PosterUrl, StoragePaths.AnimePosters);
                anime.UpdatePosterFileName(saved);
            }

            // ===================== Оновлення скриншотів =====================
            var screenshotFiles = new List<string>();

            // Скріншоти по файлам
            if (request.Screenshots != null && request.Screenshots.Any())
            {
                foreach (var file in request.Screenshots)
                {
                    if (file.Length == 0) continue;

                    using var stream = file.OpenReadStream();
                    var uploadedFile = await _fileStorage.UploadFileAsync(stream, file.FileName, StoragePaths.AnimeScreenshots);
                    screenshotFiles.Add(uploadedFile);
                }
            }

            // Скріншоти по URL
            if (request.ScreenshotUrls != null && request.ScreenshotUrls.Any())
            {
                var screenshots = await _fileStorage.UploadImagesFromUrlsAsync(request.ScreenshotUrls, StoragePaths.AnimeScreenshots);
                screenshotFiles.AddRange(screenshots);
            }

            if (screenshotFiles.Count != 0)
                anime.UpdateScreenshotsFileName(screenshotFiles);
           

            await _animeRep.UpdateAsync(anime);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int animeId)
        {
            var anime = await GetAnimeByIdAsync(animeId);
            await _animeRep.DeleteAsync(anime);
        }

        // ============================== private methods ====================================

        /// <summary> Повертає сутність аніме по айді </summary>
        /// <exception cref="NotFoundException"></exception>
        private async Task<Anime> GetAnimeByIdAsync(int animeId) =>
            await _animeRep.GetByIdAsync(animeId) ?? throw new NotFoundException("Anime", animeId);       
    }
}
