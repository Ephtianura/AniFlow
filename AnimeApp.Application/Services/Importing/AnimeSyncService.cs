using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Commands;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.External;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Application.Helpers;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;
using MassTransit;
using MassTransit.Initializers;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace AnimeApp.Application.Services.Importing
{
    public class AnimeSyncService(
        IMoonApiClient moonApi,
        IUnitOfWork unitOfWork,
        IIdCatalogRepository catalogRep,
        IPublishEndpoint publishEndpoint,
        IGengesFactory gengesFactory,
        ILogger<AnimeSyncService> logger) : IAnimeSyncService
    {
        private readonly IMoonApiClient _moonApi = moonApi;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IIdCatalogRepository _catalogRep = catalogRep;
        private readonly IPublishEndpoint _publishEndpoint = publishEndpoint;
        private readonly IGengesFactory _gengesFactory = gengesFactory;
        private readonly ILogger<AnimeSyncService> _logger = logger;

        public async Task<CreatedCountResult> DumpMoonDbToCatalog()
        {
            var sw = Stopwatch.StartNew();
            _logger.LogInformation(LogEvents.CatalogDumpStarted, "Дамп каталогу запущений");

            CreatedCountResult res = new();
            var animeIds = await _moonApi.GetAllAnimeIdsAsync();
            var exist = await _catalogRep.GetAllByMalIds(animeIds.Where(i => i.MalId != null).Select(i => i.MalId!.Value).ToList());

            var existIds = exist
                .Select(x => x.MalId)
                .ToHashSet();

            var idCatalog = animeIds
                .Where(i => i.MalId != null && !existIds.Contains(i.MalId!.Value))
                .GroupBy(i => i.MalId!.Value)
                .Select(g => g.First())
                .Select(i => AnimeIdCatalog.Create(i.MoonId, i.MalId!.Value))
                .ToList();

            await _catalogRep.AddRangeAsync(idCatalog);
            res.Created = idCatalog.Count;
            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation(LogEvents.CatalogDumpCompleted, "Дамп каталогу айді завершений за {ElapsedMs}ms. Результат: @{Res}", sw.ElapsedMilliseconds, res);
            return res;
        }

        // Виконується 1 раз або раз на N часу
        public async Task SeedDbFromCatalog()
        {
            _logger.LogInformation(LogEvents.AnimeDatabaseFillStarted, "Заповнення бази аніме розпочато.");
            var pendingIds = await _catalogRep.GetUnparsedIdsAsync();

            var publishTasks = pendingIds.Select(entry =>
                _publishEndpoint.Publish(new ParseNewAnimeCommand(entry.MoonId)));

            // Фигачим их в RabbitMQ одновременно
            await Task.WhenAll(publishTasks);

            _logger.LogInformation(LogEvents.AnimeQueuePublished, "Всі події на заповнення успішно відправлені в чергу");
        }
        public Task<CreateUpdateResult> SeedDbWithGenres() => _gengesFactory.ImportGenres();

        // Якщо MoonId новий - створюємо, якщо ні - то порівнюємо з останнім апдейтом і якщо що оновлюємо
        public async Task CheckLastUpdated()
        {
            _logger.LogInformation(LogEvents.AnimeUpdateCheckStarted, "Почалась перевірка оновлення аніме");
            var recent = await _moonApi.LastAnimeUpdated();

            Dictionary<int, EpisodeRecent> updatesMap = recent
                .GroupBy(e => e.MoonId)
                .ToDictionary(g => g.Key, g => g.OrderByDescending(x => x.DatePublished).First());

            var moonIds = updatesMap.Keys.ToList();

            var existingInDb = await _catalogRep.GetByMoonIdsAsync(moonIds);

            var dbMap = existingInDb.ToDictionary(x => x.MoonId);

            foreach (var moonId in moonIds)
            {
                var update = updatesMap[moonId];

                if (!dbMap.TryGetValue(moonId, out var catalogEntry)) // Нове аніме
                {
                    _logger.LogInformation(LogEvents.NewAnimeFound, "Знайдено нове аніме! MoonId: {MoonId}, MalId: {MalId}", update.MoonId, update.MalId);
                    catalogEntry = AnimeIdCatalog.Create(update.MoonId, update.MalId ?? 0);
                    await _catalogRep.AddAsync(catalogEntry);
                    await _unitOfWork.SaveChangesAsync();
                    _logger.LogInformation("Запис у каталогу створено! Починаємо створювати аніме...");
                    await _publishEndpoint.Publish(new ParseNewAnimeCommand(catalogEntry.MoonId));
                }
                else // Аніме вже є
                {
                    // Якщо дата оновлення в Апі свіжіше ніж у нас
                    if (update.DatePublished > catalogEntry.LastUpdated)
                    {
                        _logger.LogInformation(LogEvents.AnimeUpdateFound, "Знайдено оновлення для аніме MoonId: {MoonId}! Починаємо оновлювати... ", catalogEntry.MoonId);
                        await _publishEndpoint.Publish(new UpdateAnimeCommand(catalogEntry.MoonId, update.DatePublished));
                    }
                }
            }
        }

    }
}
