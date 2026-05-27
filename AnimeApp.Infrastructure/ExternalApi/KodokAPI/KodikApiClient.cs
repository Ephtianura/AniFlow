using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.External;
using AnimeApp.Application.Exceptions;
using AnimeApp.Infrastructure.ExternalApi.KodokAPI.Dto;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json;

namespace AnimeApp.Infrastructure.ExternalApi.KodokAPI
{
    public class KodikApiClient(HttpClient httpClient, IConfiguration config) : IKodikApiClient
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly string _apiKey = config["KodikApi:ApiKey"]
            ?? throw new InvalidOperationException("KodikApi:ApiKey not configured");
        public Task<KodikScreenshotsResult> GetScreenshots(int shikimoriId)
        {
            var url = $"search?token={_apiKey}&shikimori_id={shikimoriId}&limit=1&with_episodes_data=true";

            return ExecuteKodikAsync(async () =>
            {
                var response = await _httpClient.GetFromJsonAsync<KodikResponse>(url)
                    ?? throw new ExternalApiEmptyResponseException("Kodik API returned empty response");

                var kodikId = response.Result?
                    .Where(i => i != null && !string.IsNullOrWhiteSpace(i.KodikId))
                    .Select(i => i.KodikId)
                    .FirstOrDefault();

                var screenshots = response.Result?
                    .Where(s => s?.Season != null)
                    .SelectMany(s => s.Season.Values.Where(v => v?.Episodes != null))
                    .SelectMany(e => e.Episodes.Values.Where(v => v?.Screenshots != null))
                    .SelectMany(sc => sc.Screenshots)
                    .Where(url => !string.IsNullOrWhiteSpace(url)) 
                    .ToList() ?? [];

                return new KodikScreenshotsResult(kodikId, screenshots);
            });
        }

        public Task<List<VoiceEpisodeSet>> GetEpisodes(int shikimoriId)
        {
            var url = $"search?token={_apiKey}&shikimori_id={shikimoriId}&limit=1&with_episodes_data=true";

            return ExecuteKodikAsync(async () =>
            {
                var response = await _httpClient.GetFromJsonAsync<KodikResponse>(url)
                    ?? throw new ExternalApiEmptyResponseException("Kodik API returned empty response");

                var episodeLinks = response.Result.SelectMany(r => r.Season.Values).ToList();

                return episodeLinks
                .ConvertAll(s => new VoiceEpisodeSet(
                    "",
                    s.Episodes.Select(e =>
                    {
                        if (!int.TryParse(e.Key, out var episodeNumber))
                            return null;

                        return new EpisodeInfo(
                            episodeNumber,
                            e.Value.EpisodeLink,
                            null,
                            false
                        );
                    })
                    .Where(x => x != null)
                    .ToList()!
                ));
            });
        }

        /// <summary> Функція для перевірки валідності KodikApi </summary>
        /// <exception cref="ExternalApiTimeoutException"></exception>
        /// <exception cref="ExternalApiHttpException"></exception>
        /// <exception cref="ExternalApiInvalidResponseException"></exception>
        private static async Task<T> ExecuteKodikAsync<T>(Func<Task<T>> action)
        {
            try
            {
                return await action();
            }
            catch (TaskCanceledException ex)
            {
                throw new ExternalApiTimeoutException("Kodik API timeout", ex);
            }
            catch (HttpRequestException ex)
            {
                throw new ExternalApiHttpException("Kodik API HTTP error", ex);
            }
            catch (JsonException ex)
            {
                throw new ExternalApiInvalidResponseException("Kodik API invalid JSON", ex);
            }
        }
    }
}
