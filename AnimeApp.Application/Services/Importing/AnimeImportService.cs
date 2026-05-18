using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Commands;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Exceptions;
using AnimeApp.Application.Helpers;
using AnimeApp.Core.Contracts;
using AnimeApp.Core.Models;
using Microsoft.Extensions.Logging;

namespace AnimeApp.Application.Services.Importing
{
    public class AnimeImportService(
        IAnimeFactory animeFactory,
        IAnimeRepository animeRep,
        IMoonApiClient moonApi,
        IIdCatalogRepository catalogRep,
        IS3FileStorageService fileStorage,
        ILogger<AnimeImportService> logger
        ) : IAnimeImportService
    {
        private readonly IAnimeFactory _animeFactory = animeFactory;
        private readonly IAnimeRepository _animeRep = animeRep;
        private readonly IMoonApiClient _moonApi = moonApi;
        private readonly IIdCatalogRepository _catalogRep = catalogRep;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly ILogger<AnimeImportService> _logger = logger;

        public async Task ParseNewAnime(ParseNewAnimeCommand request)
        {
            Anime? anime = null;
            try
            {
                var raw = await _moonApi.GetFullAnimeInfo(request.MoonId);

                anime = await _animeFactory.BuildAnimeFromRaw(raw);

                var catalog = await _catalogRep.GetByIdsAsync(request.MoonId);

                // На всякий
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
                // Save

                anime.UpdateUrl($"{anime.Url}-{anime.Id}");
                await _animeRep.UpdateAsync(anime);
                // Save
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

                _logger.LogError(ex, "Не вдалося створити аніме для MoonId: {MoonId}", request.MoonId);
                throw new InvalidOperationException("Не вдалося створити аніме через внутрішню помилку.", ex);
            }
        }
        public async Task UpdateTechFields(UpdateAnimeCommand context)
        {
            var raw = await _moonApi.GetFullAnimeInfo(context.MoonId);

            var anime = await _animeRep.GetByMoonIdAsync(context.MoonId)
                ?? throw new NotFoundException("Anime", context.MoonId);

            if (raw.AiredOn != null)
                anime.UpdateAiredOn(raw.AiredOn.Value);
            if (raw.ReleasedOn != null)
                anime.UpdateReleasedOn(raw.ReleasedOn.Value);
            if (raw.EpisodesAired != null)
                anime.UpdateEpisodesAired(raw.EpisodesAired.Value);
            if (raw.Episodes != null)
                anime.UpdateEpisodes(raw.Episodes.Value);
            if (raw.Status != null)
            {
                var status = AniBuilder.MapStatus(raw.Status);
                anime.UpdateStatus(status);
            }

            await _catalogRep.MarkUpdated(context.MoonId, context.DatePublished);
            await _animeRep.UpdateAsync(anime);
        }

    }
}
