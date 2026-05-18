using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Commands;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.External;
using AnimeApp.Application.Dto.Responses.Anime;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;
using MassTransit;
using MassTransit.Initializers;

namespace AnimeApp.Application.Services.Importing
{
    public class AnimeSyncService(
        IMoonApiClient moonApi,
        IIdCatalogRepository catalogRep,
        IPublishEndpoint publishEndpoint,
        IGengesFactory gengesFactory) : IAnimeSyncService
    {
        private readonly IMoonApiClient _moonApi = moonApi;
        private readonly IIdCatalogRepository _catalogRep = catalogRep;
        private readonly IPublishEndpoint _publishEndpoint = publishEndpoint;
        private readonly IGengesFactory _gengesFactory = gengesFactory;

        public async Task<CreatedCountResult> DumpMoonDbToCatalog()
        {
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
            return res;
        }

        // Виконується 1 раз або раз на N часу
        public async Task SeedDbFromCatalog()
        {
            var pendingIds = await _catalogRep.GetUnparsedIdsAsync();

            foreach (var entry in pendingIds)
            {
                await _publishEndpoint.Publish(new ParseNewAnimeCommand(entry.MoonId));
            }
        }
        public Task<CreateUpdateResult> SeedDbWithGenres() => _gengesFactory.ImportGenres();

        // Якщо MoonId новий - створюємо, якщо ні - то порівнюємо з останнім апдейтом і якщо що оновлюємо
        public async Task CheckLastUpdated()
        {
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
                    catalogEntry = AnimeIdCatalog.Create(update.MoonId, update.MalId ?? 0);
                    await _catalogRep.AddAsync(catalogEntry);

                    await _publishEndpoint.Publish(new ParseNewAnimeCommand(catalogEntry.MoonId));
                }
                else // Аніме вже є
                {
                    // Якщо дата оновлення в Апі свіжіше ніж у нас
                    if (update.DatePublished > catalogEntry.LastUpdated)
                    {
                        await _publishEndpoint.Publish(new UpdateAnimeCommand(catalogEntry.MoonId, update.DatePublished));
                    }
                }
            }
        }

    }
}
