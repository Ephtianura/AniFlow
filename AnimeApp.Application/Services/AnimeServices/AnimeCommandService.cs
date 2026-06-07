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
using Microsoft.Extensions.Logging;
using System.Xml.Linq;

namespace AnimeApp.Application.Services.AnimeServices
{
    public class AnimeCommandService(
        IAnimeRepository animes,
        IUnitOfWork unitOfWork,
        IStudioRepository studios,
        IGenreRepository genres,
        IS3FileStorageService fileStorage,
        ILogger<AnimeCommandService> logger
        ) : IAnimeCommandService
    {
        private readonly IAnimeRepository _animeRep = animes;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IStudioRepository _studios = studios;
        private readonly IGenreRepository _genres = genres;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly ILogger<AnimeCommandService> _logger = logger;

        // Create
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
                studio = await _studios.GetWithAnimesByIdAsync(request.StudiosId.Value);
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
                Source = request.Source,
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
                Duration = request.Duration,
                Nsfw = request.Nsfw
            });

            await _animeRep.AddAsync(anime);
            await _unitOfWork.SaveChangesAsync();
            // Генерація URL з офіційного Romaji title
            anime.UpdateUrl(AniBuilder.GenerateSlug(officialRomajiTitle.Value, anime.Id));

            await _unitOfWork.SaveChangesAsync();
            return new AnimeCreateResponse(
                anime.Id,
                anime.Url,
                anime.Titles
            );
        }

        // Update
        public async Task UpdateBaseAsync(int animeId, AnimeUpdateRequest request)
        {
            var anime = await _animeRep.GetWithGenresStudioByIdAsync(animeId)
                ?? throw new NotFoundException("Anime", animeId);

            // ===================== Studio =====================
            if (request.StudiosId.HasValue && request.StudiosId.Value != anime.StudiosId)
            {
                var studio = await _studios.GetWithAnimesByIdAsync(request.StudiosId.Value)
                    ?? throw new NotFoundException("Studio", request.StudiosId.Value);
                anime.SetStudio(studio);
            }

            // ===================== Genres =====================
            if (request.GenresIds != null)
            {
                var requestedGenres = await _genres.GetByIdsAsync(request.GenresIds);

                if (requestedGenres.Count != request.GenresIds.Count)
                    throw new BadRequestException("Some genre IDs are invalid.");

                var genresToRemove = anime.Genres.Where(g => !request.GenresIds.Contains(g.Id)).ToList();

                foreach (var genre in genresToRemove)
                {
                    anime.RemoveGenre(genre);
                }

                var currentGenreIds = anime.Genres.Select(g => g.Id).ToHashSet();
                foreach (var genre in requestedGenres)
                {
                    if (!currentGenreIds.Contains(genre.Id))
                    {
                        anime.AddGenre(genre);
                    }
                }
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

            // ===================== Інші =====================
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
            if (request.Source.HasValue && request.Source != anime.Source)
                anime.Source = request.Source.Value;

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

            if (!string.IsNullOrWhiteSpace(request.Description) && request.Description != anime.Description)
                anime.UpdateDescription(request.Description);

            if (request.Nsfw.HasValue && request.Nsfw != anime.Nsfw)
                anime.Nsfw = request.Nsfw.Value;

            await _unitOfWork.SaveChangesAsync();
        }

        // Update Files
        public async Task UpdateFilesAsync(int animeId, AnimeUpdateFilesRequest request)
        {
            if (request.Poster == null && string.IsNullOrWhiteSpace(request.PosterUrl) &&
               (request.Screenshots == null || !request.Screenshots.Any()) &&
                (request.ScreenshotUrls == null || !request.ScreenshotUrls.Any()))
                throw new ArgumentException("Необхідно завантажити хоча б постер чи один скріншот.");

            var anime = await GetAnimeOrThrowAsync(animeId);

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

            await _unitOfWork.SaveChangesAsync();
        }

        // Delete
        public async Task DeleteAsync(int animeId)
        {
            var anime = await GetAnimeOrThrowAsync(animeId);

            var filesToDelete = new List<string>();

            if (!string.IsNullOrWhiteSpace(anime.PosterFileName))
                filesToDelete.Add(anime.PosterFileName);

            if (anime.ScreenshotsFileName != null)
                filesToDelete.AddRange(anime.ScreenshotsFileName);

            try
            {
                await _animeRep.DeleteAsync(anime);
                await _unitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Не вдалося видалити аніме {AnimeTitle}. AnimeId: {AnimeId}",
                    anime.Titles, animeId);
                throw;
            }


            var s3Result = await _fileStorage.DeleteFilesAsync(filesToDelete);

            if (s3Result?.Errors != null && s3Result.Errors.Count != 0)
            {
                _logger.LogWarning("Не вдалося видалити медіа при видаленні аніме {AnimeTitle}. AnimeId: {AnimeId}. S3Errors: {S3Errors}",
                    anime.OfficialRomajiTitle, animeId, s3Result.Errors);
            }
        }

        // Order
        public async Task OrderScreenshots(int animeId, AnimeOrderScreenshotsRequest request)
        {
            var anime = await GetAnimeOrThrowAsync(animeId);

            var currentScreenshots = anime.ScreenshotsFileName ?? [];

            var candidateToDelete = currentScreenshots.Except(currentScreenshots).ToList();

            var realDeletedFromS3 = new List<string>();

            if (candidateToDelete.Count != 0)
            {
                var s3Result = await _fileStorage.DeleteFilesAsync(candidateToDelete);

                if (s3Result?.Deleted != null)
                    realDeletedFromS3 = s3Result.Deleted;

                if (s3Result?.Errors != null && s3Result.Errors.Count != 0)
                {
                    _logger.LogWarning("Не вдалося видалити скріншоти для аніме {AnimeTitle}. AnimeId: {AnimeId}. S3Errors: {S3Errors}",
                        anime.OfficialRomajiTitle, animeId, s3Result.Errors);
                }
            }

            var failedToDelete = candidateToDelete.Except(realDeletedFromS3).ToList();

            if (failedToDelete.Count != 0)
            {
                request.OrderedScreenshots.AddRange(failedToDelete);
            }

            anime.UpdateScreenshotsFileName(request.OrderedScreenshots);
            await _unitOfWork.SaveChangesAsync();
        }


        // Related
        public async Task<RelatedUpdateResult> UpdateRelated(int animeId, RelatedsAnimeRequest request)
        {
            var anime = await _animeRep.GetWithRelateds(animeId)
                ?? throw new NotFoundException("Anime", animeId);

            var newRelations = request.RelatedsAnimes ?? [];

            // Видаляємо зв'язки, яких більше немає у запиті
            var existingIds = anime.Relateds.ConvertAll(r => r.RelatedAnimeId);
            var newIds = newRelations.ConvertAll(r => r.RelatedAnimeId);
            var toRemove = existingIds.Except(newIds).ToList();

            var updatedList = new List<RelatedAnimeItem>();
            var deletedList = new List<RelatedAnimeItem>();

            foreach (var relatedId in toRemove)
            {
                var oldRelation = anime.Relateds.FirstOrDefault(r => r.RelatedAnimeId == relatedId);
                if (oldRelation != null)
                {
                    deletedList.Add(new RelatedAnimeItem(relatedId, oldRelation.Type));
                }

                anime.RemoveRelated(relatedId);

                // Видаляємо зворотний зв'язок
                var relatedAnime = await _animeRep.GetWithRelateds(relatedId);
                relatedAnime?.RemoveRelated(anime.Id);
            }

            // Оновлюємо або додаємо зв'язки
            foreach (var rel in newRelations)
            {
                var existingRelation =
                    anime.Relateds.FirstOrDefault(r => r.RelatedAnimeId == rel.RelatedAnimeId);

                if (existingRelation != null)
                {
                    // Якщо тип змінився — оновлюємо обидві сторони
                    if (existingRelation.Type != rel.RelationKind)
                    {
                        updatedList.Add(rel);

                        existingRelation.UpdateType(rel.RelationKind);

                        var relatedAnime = await _animeRep.GetWithRelateds(rel.RelatedAnimeId);
                        var reverseKind = RelationKindMap.GetReverse(rel.RelationKind);

                        if (relatedAnime != null && reverseKind != null)
                        {
                            var reverseRelation =
                                relatedAnime.Relateds.FirstOrDefault(r => r.RelatedAnimeId == anime.Id);

                            reverseRelation?.UpdateType(reverseKind.Value);
                        }
                    }
                }
                else
                {
                    // Створюємо новий зв'язок
                    var relatedAnime = await _animeRep.GetWithRelateds(rel.RelatedAnimeId);

                    if (relatedAnime != null)
                    {
                        anime.AddRelated(relatedAnime, rel.RelationKind);

                        // Додаємо зворотний зв'язок
                        var reverse = RelationKindMap.GetReverse(rel.RelationKind);

                        if (reverse != null)
                        {
                            relatedAnime.AddRelated(anime, reverse.Value);
                        }
                    }
                }
            }

            await _unitOfWork.SaveChangesAsync();

            var currentList = anime.Relateds.ConvertAll(r => new RelatedAnimeItem(r.RelatedAnimeId, r.Type));

            return new RelatedUpdateResult(currentList, updatedList, deletedList);
        }


        // ============================== private methods ====================================

        /// <summary> Повертає аніме по айді </summary>
        /// <exception cref="NotFoundException"></exception>
        private async Task<Anime> GetAnimeOrThrowAsync(int animeId) =>
            await _animeRep.GetByIdAsync(animeId) ?? throw new NotFoundException("Anime", animeId);

    }
}
