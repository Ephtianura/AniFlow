using Amazon.S3;
using Amazon.S3.Transfer;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.External;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;

namespace AnimeApp.Infrastructure.FileStorage
{
    public class S3FileStorageService(
        HttpClient httpClient,
        IAmazonS3 s3Client,
        string bucketName,
        IConfiguration config,
        ILogger<S3FileStorageService> logger) : IS3FileStorageService
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly IAmazonS3 _s3Client = s3Client;
        private ILogger<S3FileStorageService> _logger = logger;
        private readonly string _bucketName = bucketName;
        private readonly string _baseUrl = config["Minio:PublicUrl"]!.TrimEnd('/');

        private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(5);

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string folder, CancellationToken ct = default)
        {
            var key = $"{folder}/{Guid.NewGuid()}_{fileName}";

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = fileStream,
                Key = key,
                BucketName = _bucketName,
                CannedACL = S3CannedACL.PublicRead
            };

            var transferUtility = new TransferUtility(_s3Client);
            await transferUtility.UploadAsync(uploadRequest, ct);

            return key;
        }


        public async Task<string?> UploadImageFromUrlAsync(string currentUrl, string folder, CancellationToken ct = default)
        {
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            cts.CancelAfter(TimeSpan.FromSeconds(5));

            try
            {
                int maxRedirects = 5;
                HttpResponseMessage? response = null;

                while (maxRedirects-- > 0)
                {
                    if (currentUrl.StartsWith("//")) currentUrl = "https:" + currentUrl;

                    var request = new HttpRequestMessage(HttpMethod.Get, currentUrl);
                    request.Headers.Add("Accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8");

                    response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cts.Token);

                    // Якщо це редирект (301, 302, 307, 308) — переписуємо URL і йдемо на наступне коло
                    if (response.StatusCode == System.Net.HttpStatusCode.Redirect ||
                        response.StatusCode == System.Net.HttpStatusCode.MovedPermanently ||
                        response.StatusCode == System.Net.HttpStatusCode.Found ||
                        response.StatusCode == System.Net.HttpStatusCode.SeeOther)
                    {
                        var location = response.Headers.Location?.ToString();
                        if (string.IsNullOrEmpty(location)) return null;

                        currentUrl = location;
                        response.Dispose(); // Звільняємо ресурси старого запиту перед наступним кроком
                        continue;
                    }

                    // Якщо це не редирект — виходимо з циклу обробляти результат
                    break;
                }

                // Перевіряємо фінальну відповідь (тут вже має бути 200 OK)
                if (response == null || !response.IsSuccessStatusCode) return null;

                // Читаємо і заливаємо в S3
                using (response)
                {
                    using var responseStream = await response.Content.ReadAsStreamAsync(cts.Token);
                    using var ms = new MemoryStream();
                    await responseStream.CopyToAsync(ms, cts.Token);

                    byte[] imageBytes = ms.ToArray();
                    if (imageBytes.Length == 0) return null;

                    var format = Image.DetectFormat(imageBytes);
                    if (format == null)
                    {
                        _logger.LogWarning("Файл не є валідним зображенням: {Url}", currentUrl);
                        return null;
                    }

                    var fileName = $"{Guid.NewGuid()}.{format.FileExtensions.First()}";
                    ms.Position = 0;

                    return await UploadFileAsync(ms, fileName, folder, cts.Token);
                }
            }
            catch (OperationCanceledException) when (!ct.IsCancellationRequested)
            {
                _logger.LogWarning("Таймаут 15с по картинці: {Url}", currentUrl);
                return null;
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException?.Message ?? "None";
                _logger.LogError(ex, "Не вдалося завантажити картинку по URL: {Url}. Inner error: {Inner}", currentUrl, innerMessage);
                return null;
            }
        }

        public async Task<List<string>> UploadImagesFromUrlsAsync(IEnumerable<string> urls, string folder, CancellationToken ct = default)
        {
            var urlList = urls.Distinct().ToList(); 
            var results = new List<string>();

            const int batchSize = 10;

            for (int i = 0; i < urlList.Count; i += batchSize)
            {
                var batch = urlList.Skip(i).Take(batchSize);

                var batchTasks = batch.Select(url => UploadImageFromUrlAsync(url, folder, ct));

                var batchResults = await Task.WhenAll(batchTasks);

                foreach (var res in batchResults)
                {
                    if (res is not null) results.Add(res);
                }

                await Task.Delay(300, ct);
            }

            return results;
        }

        public async Task<S3DeleteResult> DeleteFilesAsync(IEnumerable<string> keys)
        {
            var objects = keys
                .Where(k => !string.IsNullOrWhiteSpace(k))
                .Select(k => new Amazon.S3.Model.KeyVersion
                {
                    Key = k.TrimStart('/')
                })
                .ToList();

            if (objects.Count == 0)
                return new S3DeleteResult();

            var request = new Amazon.S3.Model.DeleteObjectsRequest
            {
                BucketName = _bucketName,
                Objects = objects,
                Quiet = false
            };

            var response = await _s3Client.DeleteObjectsAsync(request);

            return new S3DeleteResult
            {
                Deleted = response.DeletedObjects?
                        .Select(x => x.Key)
                        .ToList() ?? [],

                Errors = response.DeleteErrors?
                        .Select(e => new S3DeleteError
                        {
                            Key = e.Key,
                            Code = e.Code,
                            Message = e.Message
                        })
                        .ToList() ?? []
            };

        }

        public string GetUrl(string key)
        {
            key = key.TrimStart('/');
            return $"{_baseUrl}/{_bucketName}/{key}";
        }
    }
}
