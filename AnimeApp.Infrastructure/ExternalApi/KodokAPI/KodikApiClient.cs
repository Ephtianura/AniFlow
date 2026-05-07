using AnimeApp.Infrastructure.Exceptions;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json;

namespace AnimeApp.Infrastructure.ExternalApi.KodokAPI
{
    public class KodikApiClient(HttpClient httpClient, IConfiguration config)
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly string _apiKey = config["KodikApi:ApiKey"]
            ?? throw new InvalidOperationException("KodikApi:ApiKey not configured");

        //       W.I.P.

        /// <summary> Повертає масив скріншотів </summary>
        /// <param name="shikimoriId">ShikimoriId = MalId</param>
        public Task<List<string>?> GetScreenshots(int shikimoriId)
        {
            var url = $"/search?token={_apiKey}&shikimori_id={shikimoriId}&limit=1&with_episodes_data=true";

            return ExecuteKodikAsync(async () =>
            {
                var response = await _httpClient.GetFromJsonAsync<List<string>?>(url)
                    ?? throw new ExternalApiEmptyResponseException("Kodik API returned empty response");

                return response ?? null;
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
