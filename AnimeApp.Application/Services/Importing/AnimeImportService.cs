using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Commands;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Exceptions;
using AnimeApp.Application.Helpers;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;
using MassTransit;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace AnimeApp.Application.Services.Importing
{
    public class AnimeImportService(
        IAnimeFactory animeFactory,
        IAnimeRepository animeRep,
        IUnitOfWork unitOfWork,
        IMoonApiClient moonApi,
        IIdCatalogRepository catalogRep,
        IS3FileStorageService fileStorage,
        ILogger<AnimeImportService> logger,
        IPublishEndpoint publishEndpoint
        ) : IAnimeImportService
    {
        private readonly IAnimeFactory _animeFactory = animeFactory;
        private readonly IAnimeRepository _animeRep = animeRep;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IMoonApiClient _moonApi = moonApi;
        private readonly IIdCatalogRepository _catalogRep = catalogRep;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly ILogger<AnimeImportService> _logger = logger;
        private readonly IPublishEndpoint _publishEndpoint = publishEndpoint;


        public async Task ParseNewAnime(ParseNewAnimeCommand request)
        {
            var sw = Stopwatch.StartNew();
            _logger.LogInformation(LogEvents.AnimeImportStarted, "Отримано запит на парсінг аніме. MoonId: {MoonId}", request.MoonId);
            Anime? anime = null;
            try
            {
                var raw = await _moonApi.GetFullAnimeInfo(request.MoonId);
                _logger.LogInformation(LogEvents.MoonApiDataReceived, "Отримана інформація з MoonAPI. MoonId: {MoonId}", request.MoonId);

                if (string.IsNullOrWhiteSpace(raw?.Slug) &&
                    string.IsNullOrWhiteSpace(raw?.TitleJa) &&
                    string.IsNullOrWhiteSpace(raw?.TitleEn))
                {
                    _logger.LogWarning(
                        LogEvents.MoonApiDataInvalid,
                        "MoonAPI повернув пусті дані. Відсутня оригінальна назва. MoonId: {MoonId}",
                        request.MoonId);

                    return;
                }

                var isExist = await CheckExist(raw.MalId, sw);
                if (isExist) return;

                anime = await _animeFactory.BuildAnimeFromRaw(raw);

                _logger.LogInformation(LogEvents.AnimeConstructed, "Аніме {AnimeName} успішно сконструйовано. MoonId: {MoonId}", anime.Titles.FirstOrDefault(), request.MoonId);

                var catalog = await _catalogRep.GetByIdsAsync(moonId: request.MoonId);

                if (catalog == null)
                {
                    catalog = AnimeIdCatalog.Create(request.MoonId, raw.MalId, anime.KodikId, true);
                    await _catalogRep.AddAsync(catalog);
                }
                else
                {
                    catalog.MarkAsParsed();
                    await _catalogRep.UpdateAsync(catalog);
                }

                await _animeRep.AddAsync(anime);

                await _unitOfWork.SaveChangesAsync();

                _logger.LogInformation("Аніме {AnimeName} успішно збережено в базу, іде оновлення Url... MoonId: {MoonId}", anime.Titles.FirstOrDefault(), request.MoonId);

                anime.UpdateUrl($"{anime.Url}-{anime.Id}");
                await _animeRep.UpdateAsync(anime);
                await _unitOfWork.SaveChangesAsync();
                _logger.LogInformation(LogEvents.AnimeUrlUpdated, "Url для аніме {AnimeName} оновлено! Url: {Url} MoonId: {MoonId}", anime.Titles.FirstOrDefault(), anime.Url, request.MoonId);

                _logger.LogInformation(LogEvents.AnimeImportCompleted, "Парсінг по MoonId: {MoonId} успішно завершений за {ElapsedMs}ms. Url: {Url}",
                    anime.MoonId, sw.ElapsedMilliseconds, anime.Url);
            }
            catch (Exception ex)
            {
                if (anime?.Id == 0)
                {
                    var toDelete = anime?.ScreenshotsFileName ?? [];
                    if (!string.IsNullOrWhiteSpace(anime?.PosterFileName))
                        toDelete.Add(anime.PosterFileName);
                    if (toDelete.Count > 0)
                        await _fileStorage.DeleteFilesAsync(toDelete);
                }

                _logger.LogError(LogEvents.AnimeImportFailed, ex, "Не вдалося створити аніме для MoonId: {MoonId}. Id: {AnimeId}. Url: {AnimeUrl}", request.MoonId, anime?.Id, anime?.Url);
                throw new InvalidOperationException("Не вдалося створити аніме через внутрішню помилку.", ex);
            }
        }
        public async Task UpdateTechFields(UpdateAnimeCommand context)
        {
            _logger.LogInformation("Отримано запит на оновлення аніме. MoonId: {MoonId}", context.MoonId);

            var raw = await _moonApi.GetFullAnimeInfo(context.MoonId);
            _logger.LogInformation(LogEvents.MoonApiDataReceived, "Отримана інформація з MoonAPI. MoonId: {MoonId}", context.MoonId);

            var anime = await _animeRep.GetByMoonIdAsync(context.MoonId);

            if (anime == null)
            {
                _logger.LogWarning("Аніме з MoonId {MoonId} не знайдено для оновлення. Відправляємо на створення.", context.MoonId);
                await _publishEndpoint.Publish(new ParseNewAnimeCommand(context.MoonId));
                return;
            }

            bool isUpdated = false;

            if (raw.AiredOn != null && anime.AiredOn != raw.AiredOn.Value)
            {
                anime.UpdateAiredOn(raw.AiredOn.Value);
                isUpdated = true;
            }

            if (raw.ReleasedOn != null && anime.ReleasedOn != raw.ReleasedOn.Value)
            {
                anime.UpdateReleasedOn(raw.ReleasedOn.Value);
                isUpdated = true;
            }

            if (raw.EpisodesAired != null && anime.EpisodesAired != raw.EpisodesAired.Value)
            {
                anime.UpdateEpisodesAired(raw.EpisodesAired.Value);
                isUpdated = true;
            }

            if (raw.Episodes != null && anime.Episodes != raw.Episodes.Value)
            {
                anime.UpdateEpisodes(raw.Episodes.Value);
                isUpdated = true;
            }

            if (raw.Status != null)
            {
                var status = AniBuilder.MapStatus(raw.Status);
                if (anime.Status != status)
                    anime.UpdateStatus(status);
                isUpdated = true;
            }

            if (isUpdated)
            {
                var utcDatePublished = context.DatePublished.Kind == DateTimeKind.Utc
                    ? context.DatePublished
                    : DateTime.SpecifyKind(context.DatePublished, DateTimeKind.Utc);

                await _catalogRep.MarkUpdated(context.MoonId, utcDatePublished);
                await _unitOfWork.SaveChangesAsync();
                _logger.LogInformation(LogEvents.AnimeUpdated, "Оновлення аніме успішно завершено. MoonId: {MoonId}", context.MoonId);
            }
            else
            {
                _logger.LogInformation(LogEvents.AnimeUpdated, "Оновлень для аніме {AnimeName} не знайдено. MoonId: {MoonId}", 
                    anime.Titles.FirstOrDefault(), context.MoonId);
            }

        }

        // Запобіжник, на випадок, якщо аніме створене вручну та з MalId, але не помічено як зпарсене
        public async Task<bool> CheckExist(int malId, Stopwatch sw)
        {
            var anime = await _animeRep.GetByMalIdAsync(malId);
            if (anime != null)
            {
                _logger.LogWarning(LogEvents.AnimeAlreadyExists, "Аніме з MalId {MalId} вже існує. MoonId: {MoonId}", malId, anime.MoonId);
                var catalog = await _catalogRep.GetByIdsAsync(malId: malId);
                if (catalog != null)
                {
                    catalog.MarkAsParsed();
                    await _catalogRep.UpdateAsync(catalog);
                    await _unitOfWork.SaveChangesAsync();
                    _logger.LogInformation(LogEvents.AnimeImportCompleted, "Парсінг по MoonId: {MoonId} завершений за {ElapsedMs}ms. Аніме вже існує. MalId: {MalId}",
                        anime.MoonId, sw.ElapsedMilliseconds, malId);
                }
                return true;
            }
            return false;
        }

    }
}
