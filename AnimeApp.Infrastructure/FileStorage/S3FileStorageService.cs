using Amazon.S3;
using Amazon.S3.Transfer;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Application.Dto.External;
using Microsoft.Extensions.Configuration;
using System.Net.Http;

namespace AnimeApp.Infrastructure.FileStorage
{
    public class S3FileStorageService(
        HttpClient httpClient,
        IAmazonS3 s3Client,
        string bucketName,
        IConfiguration config) : IS3FileStorageService
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly IAmazonS3 _s3Client = s3Client;
        private readonly string _bucketName = bucketName;
        private readonly string _baseUrl = config["Minio:PublicUrl"]!.TrimEnd('/');

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string folder)
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
            await transferUtility.UploadAsync(uploadRequest);

            return key;
        }

        public async Task<string?> UploadImageFromUrlAsync(string url, string folder)
        {
            try
            {
                using var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                    return null;

                var contentType = response.Content.Headers.ContentType?.MediaType;

                var ext = contentType switch
                {
                    "image/png" => ".png",
                    "image/webp" => ".webp",
                    _ => ".jpg"
                };

                var fileName = $"{Guid.NewGuid()}{ext}";

                await using var stream = await response.Content.ReadAsStreamAsync();

                return await UploadFileAsync(stream, fileName, folder);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Помилка завантаження зображення {url}: {ex.Message}");
                return null;
            }
        }

        public async Task<List<string>> UploadImagesFromUrlsAsync(IEnumerable<string> urls, string folder)
        {
            var tasks = urls.Select(url => UploadImageFromUrlAsync(url, folder));

            var results = await Task.WhenAll(tasks);

            return results
                .Where(x => x is not null)
                .Cast<string>()
                .ToList();
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
