using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.External;
using AnimeApp.Core.Enums;
using AnimeApp.Infrastructure.Exceptions;
using AnimeApp.Infrastructure.ExternalApi.MoonAPI.Dto;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json;

namespace AnimeApp.Infrastructure.ExternalApi.MoonAPI
{
    public class MoonApiClient(HttpClient httpClient, IConfiguration config) : IMoonApiClient
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly string _apiKey = config["MoonApi:ApiKey"]
            ?? throw new InvalidOperationException("MoonApi:ApiKey not configured");

        public Task<AnimeIdList> GetAnimeIdsAsync(int page, int limit = 100)
        {
            var url = $"6.0/titles/filter?api_key={_apiKey}&page={page}&limit={limit}";

            return ExecuteMoonAsync(async () =>
            {
                var response = await _httpClient.GetFromJsonAsync<MoonApiAnimeIdResponse>(url)
                    ?? throw new ExternalApiEmptyResponseException("Moon API returned empty response");

                return new AnimeIdList(
                    response.AnimeList
                        .ConvertAll(x => new AnimeIdDto(
                            x.MoonId,
                            x.MalId,
                            x.AnilistId
                        )),
                    response.LastPage
                );
            });
        }

        public Task<AnimeFullRaw> GetFullAnimeInfo(int moonId)
        {
            var url = $"2.0/title/{moonId}/full?api_key={_apiKey}";

            return ExecuteMoonAsync(async () =>
            {
                var r = await _httpClient.GetFromJsonAsync<MoonApiAnimeFullResponse>(url)
                    ?? throw new ExternalApiEmptyResponseException("Moon API returned empty response");

                var companies = r.Companies
                .Where(x => x?.Company != null && !string.IsNullOrWhiteSpace(x.Type) && !string.IsNullOrWhiteSpace(x.Company.Name))
                .Select(c => new CompanyDto(
                    c.Type!,
                    c.Company!.Name!,
                    c.Company.Image,
                    c.Company.Slug))
                .ToList();

                var genres = r.Genres
                .Where(x => x != null)
                .Select(g => new GenreDto(
                    g.NameUa, // Не впевнений, чи взагалі потрібні 3/4 полів
                    g.NameEn,
                    g.Slug,
                    g.Type))
                .ToList();

                var videos = r.Videos
                .Where(x => x != null && !string.IsNullOrWhiteSpace(x.Url) && !string.IsNullOrWhiteSpace(x.Title))
                .Select(v => new VideoDto(
                    v.Url!,
                    v.Title!,
                    v.Description,
                    v.VideoType
                ))
                .ToList();

                var osts = r.Ost
                .Where(x => x != null && !string.IsNullOrWhiteSpace(x.Title))
                .Select(o => new OstDto(
                    o.Title!,
                    o.Author,
                    o.Spotify,
                    o.OstType,
                    o.Index))
                .ToList();

                var external = r.External
                .Where(x => x != null && !string.IsNullOrWhiteSpace(x.Url) && !string.IsNullOrWhiteSpace(x.Text))
                .Select(e => new ExternalLink(
                    e.Url!,
                    e.Text!,
                    e.Type))
                .ToList();

                return new AnimeFullRaw(
                    r.MalId, r.AnilistId, companies, genres, r.StartDate, r.EndDate, r.EpisodesReleased, r.EpisodesTotal,
                    r.SynopsisUa, r.SynopsisEn, r.MediaType, r.TitleUa, r.TitleEn, r.TitleJa, r.Synonyms,
                    null, r.Duration, r.Image, r.Status, r.Source, r.Rating, r.Score, r.Season, r.Year, r.Nsfw, r.Slug,
                    external, videos, osts
                );
            });
        }

        public Task<List<VoiceEpisodeSet>> GetEpisodes(int malId)
        {
            var url = $"4.0/episodes?api_key={_apiKey}&id={malId}";

            return ExecuteMoonAsync(async () =>
            {
                var response = await _httpClient.GetFromJsonAsync<Dictionary<string, List<MoonEpisodeDto>>>(url)
                    ?? throw new ExternalApiEmptyResponseException("Moon API returned empty response");
                return response.Select(x => new VoiceEpisodeSet(
                        Voice: x.Key,
                        Episodes: x.Value
                            .ConvertAll(e => new EpisodeInfo(
                                e.Episode,
                                e.VideoUrl,
                                e.Poster,
                                e.Subtitles
                            ))
                    )).ToList();
            });
        }

        public Task<List<EpisodeRecent>> LastAnimeUpdated(int page = 1, int limit = 100)
        {
            var url = $"7.0/episodes/recent?api_key={_apiKey}&page={page}&per_page={limit}&with_anime_info=true";

            return ExecuteMoonAsync(async () =>
            {
                var response = await _httpClient.GetFromJsonAsync<MoonApiEpisodesRecentResponse>(url)
                    ?? throw new ExternalApiEmptyResponseException("Moon API returned empty response");

                return response.Episodes
                    .ConvertAll(x => new EpisodeRecent(
                        DatePublished: x.DatePublished,
                        MoonId: x.Anime.MoonId,
                        MalId: x.Anime.MalId
                    ));
            });
        }


        /// <summary> Функція для перевірки валідності MoonApi </summary>
        /// <exception cref="ExternalApiTimeoutException"></exception>
        /// <exception cref="ExternalApiHttpException"></exception>
        /// <exception cref="ExternalApiInvalidResponseException"></exception>
        private static async Task<T> ExecuteMoonAsync<T>(Func<Task<T>> action)
        {
            try
            {
                return await action();
            }
            catch (TaskCanceledException ex)
            {
                throw new ExternalApiTimeoutException("Moon API timeout", ex);
            }
            catch (HttpRequestException ex)
            {
                throw new ExternalApiHttpException("Moon API HTTP error", ex);
            }
            catch (JsonException ex)
            {
                throw new ExternalApiInvalidResponseException("Moon API invalid JSON", ex);
            }
        }
    }
}