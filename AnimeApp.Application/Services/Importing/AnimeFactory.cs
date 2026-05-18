using AnimeApp.Application.Contracts.App;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.External;
using AnimeApp.Application.Helpers;
using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;
using Microsoft.Extensions.Logging;

namespace AnimeApp.Application.Services.Importing
{
    public class AnimeFactory(
        IStudioFactory studioFactory,
        IGengesFactory gengesFactory,
        IKodikApiClient kodikApi,
        IS3FileStorageService fileStorage,
        ILogger<AnimeFactory> logger) : IAnimeFactory
    {
        private readonly IStudioFactory _studioFactory = studioFactory;
        private readonly IGengesFactory _gengesFactory = gengesFactory;
        private readonly IKodikApiClient _kodikApi = kodikApi;
        private readonly IS3FileStorageService _fileStorage = fileStorage;
        private readonly ILogger<AnimeFactory> _logger = logger;

        public async Task<Anime> BuildAnimeFromRaw(AnimeFullRaw raw)
        {
            try
            {
                string slug = AniBuilder.BuildMainRomajiSlug(raw.Slug, raw.TitleJa, raw.TitleEn);

                var mainRomaji = AniBuilder.BuildRomajiFromSlug(slug);

                var titles = AniBuilder.MapTitles(mainRomaji, raw.TitleUa, raw.TitleJa, raw.TitleEn, raw.Synonyms);

                List<Genre> genres = await _gengesFactory.GetGenresFromRaw(raw.Genres ?? []);
                Studio? studio = await _studioFactory.GetStudioFromRaw(raw.Companies);

                string? poster = null;
                if (!string.IsNullOrWhiteSpace(raw.PosterUrl))
                    poster = await _fileStorage.UploadImageFromUrlAsync(raw.PosterUrl, StoragePaths.AnimePosters);

                var createParams = new CreateAnimeParams()
                {
                    Titles = titles,
                    Url = slug,

                    Kind = AniBuilder.MapKind(raw.Kind),
                    Status = AniBuilder.MapStatus(raw.Status),
                    Rating = AniBuilder.MapRating(raw.Rating),

                    Description = raw.DescriptionUa ?? raw.DescriptionEn,
                    PosterFileName = poster,

                    Genres = genres,
                    Studio = studio,

                    AiredOn = raw.AiredOn,
                    ReleasedOn = raw.ReleasedOn,
                    Season = AniBuilder.MapSeason(raw.Season),
                    Year = raw.Year,

                    Score = raw.Score,
                    Episodes = raw.Episodes,
                    EpisodesAired = raw.EpisodesAired,
                    Duration = raw.Duration,
                    Nsfw = raw.Nsfw,
                };

                var anime = Anime.Create(createParams);
                                
                anime.MoonId = raw.MoonId;
                anime.MalId = raw.MalId;
                anime.AniListId = raw.AniListId;
                anime.MoonSlug = raw.Slug;

                anime.Source = AniBuilder.MapSource(raw.Source);

                await MutateOsts(anime, raw.Osts, raw.Videos);
                anime.ExternalLinks = raw.External;

                await ImportScreenshots(anime, raw.MalId);
                return anime;
            }

            catch (ArgumentException ex)
            {
                throw new InvalidOperationException("Не вдалося створити аніме через внутрішню помилку.", ex);
            }
        }


        private async Task ImportScreenshots(Anime anime, int malId)
        {
            try
            {
                var kodikResponse = await _kodikApi.GetScreenshots(malId);
                var screenshots = await _fileStorage.UploadImagesFromUrlsAsync(kodikResponse.Screenshots, StoragePaths.AnimeScreenshots); // Надо константу
                anime.UpdateScreenshotsFileName(screenshots);
                anime.KodikId = kodikResponse.KodikId;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Не вдалося завантажити скріншоти з KodikAPI для аніме {AnimeName}, Id: {AnimeId}, MalId: {MalId}", anime.Titles.FirstOrDefault(), anime.Id, malId);
                return;
            }
        }


        private async Task MutateOsts(Anime anime, List<OstDto>? osts, List<VideoDto>? videos)
        {
            try
            {
                var music = new List<AnimeOst>();
                var promos = new List<AnimeVideo>();

                if (osts != null)
                {
                    music = osts
                            .OrderBy(x =>
                                AniBuilder.MapOstType(x.OstType) switch
                                {
                                    OstType.Opening => 0,
                                    OstType.Ending => 1,
                                    OstType.Insert => 2,
                                    _ => 3
                                })
                            .ThenBy(x => x.Index ?? int.MaxValue)
                            .Select((x, index) => new AnimeOst
                            {
                                Anime = anime,
                                Title = x.Title,
                                Author = x.Author,
                                SpotifyUrl = x.SpotifyUrl,
                                Type = AniBuilder.MapOstType(x.OstType),
                                Index = index + 1
                            })
                            .ToList();
                }

                if (videos != null)
                {
                    foreach (var video in videos)
                    {
                        var matchedOst = FindMatchingOst(video, music, osts);

                        var animeVideo = new AnimeVideo
                        {
                            Anime = anime,
                            Url = video.VideoUrl,
                            Kind = AniBuilder.MapVideoKind(video.Title),
                        };

                        // Це OST
                        if (matchedOst != null)
                            matchedOst.Videos.Add(animeVideo);
                        // Інакше промо
                        else
                            promos.Add(animeVideo);
                    }
                }

                // Сортування відео всередені остов
                foreach (var ost in music)
                {
                    ost.Videos = ost.Videos
                        .OrderBy(x => x.Kind switch
                        {
                            VideoKind.AnimeVersion => 0,
                            VideoKind.ArtistVersion => 1,
                            VideoKind.Live => 2,
                            _ => 999
                        })
                        .Select((x, index) =>
                        {
                            x.Index = index + 1;
                            return x;
                        })
                        .ToList();
                }

                // Сортування відео всередені промо
                promos = promos
                    .OrderBy(x => x.Kind switch
                    {
                        VideoKind.Teaser => 0,
                        VideoKind.Trailer => 1,
                        VideoKind.Promo => 2,
                        VideoKind.Commercial => 3,
                        _ => 999
                    })
                    .Select((x, index) =>
                    {
                        x.Index = index + 1;
                        return x;
                    })
                    .ToList();

                // Мутація
                anime.Music = music;
                anime.Promos = promos;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Невдалося завантажити ости для аніме {AnimeName}, Id: {AnimeId}", anime.Titles.FirstOrDefault(), anime.Id);
                return;
            }
        }

        private static AnimeOst? FindMatchingOst(VideoDto video, List<AnimeOst> osts, List<OstDto>? rawOsts)
        {
            var vTitle = video.Title.ToLowerInvariant();
            var vDesc = video.Description?.ToLowerInvariant() ?? "";

            foreach (var ost in osts)
            {
                var ostTitle = ost.Title.ToLowerInvariant();
                var ostAuthor = ost.Author?.ToLowerInvariant();

                // --- ШАГ 1: Намагаємося шукати по реальним даним (Пісня/Автор) ---
                if (vDesc.Contains(ostTitle) || vTitle.Contains(ostTitle)) return ost;
                if (!string.IsNullOrEmpty(ostAuthor) && (vDesc.Contains(ostAuthor) || vTitle.Contains(ostAuthor))) return ost;

                // --- ШАГ 2: "Запасний" пошук по індексу ---
                if (rawOsts == null) return null;
                var rawData = rawOsts.FirstOrDefault(x => x.Title == ost.Title);
                int apiIndex = rawData?.Index ?? 1;

                // Що конкретно будемо шукати: "op" або "ed"
                var prefix = ost.Type switch
                {
                    OstType.Opening => "op",
                    OstType.Ending => "ed",
                    _ => null
                };

                // Намагаємося знайти патерни типу "ED 1", "ED1"
                // Порівнюємо з оригінальним індексом за API
                if (prefix != null)
                {
                    if (vTitle.Contains($"{prefix} {apiIndex}") || vTitle.Contains($"{prefix}{apiIndex}")) return ost;
                }
            }

            return null;
        }
    }
}
