using Amazon.S3;
using Amazon.S3.Transfer;
using AnimeApp.Application.Contracts;
using Microsoft.Extensions.Configuration;

namespace AnimeApp.Infrastructure.FileStorage
{
    public class S3FileStorageService : IS3FileStorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly string _baseUrl;

        public S3FileStorageService(
            IAmazonS3 s3Client,
            string bucketName,
            IConfiguration config)
        {
            _s3Client = s3Client;
            _bucketName = bucketName;

            _baseUrl = config["Minio:PublicUrl"]!.TrimEnd('/');
        }

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

        public string GetUrl(string key)
        {
            key = key.TrimStart('/'); 

            return $"{_baseUrl}/{_bucketName}/{key}";
        }
    }
}
