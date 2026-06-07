using Amazon.Runtime;
using Amazon.S3;
using AnimeApp.Application.Contracts.Infra;
using AnimeApp.Infrastructure.FileStorage;

namespace AnimeApp.API.Extensions
{
    public static class AwsExtensions
    {
        public static IServiceCollection AddAws(this IServiceCollection services, IConfiguration config)
        {
            services.AddSingleton<IAmazonS3>(_ =>
            {
                var s3Config = new AmazonS3Config
                {
                    ServiceURL = config["AWS:ServiceURL"],
                    ForcePathStyle = true
                };

                var credentials = new BasicAWSCredentials(
                    config["AWS:AccessKey"],
                    config["AWS:SecretKey"]
                );

                return new AmazonS3Client(credentials, s3Config);
            });

            services.AddHttpClient("S3StorageClient", client =>
            {
                client.DefaultRequestHeaders.Add("User-Agent", "AniFlow/1.0");
                client.MaxResponseContentBufferSize = 10 * 1024 * 1024;
            });

            // 2. Регистрируем сам сервис
            services.AddSingleton<IS3FileStorageService>(sp =>
            {
                var httpClientFactory = sp.GetRequiredService<IHttpClientFactory>();
                var httpClient = httpClientFactory.CreateClient("S3StorageClient");

                return new S3FileStorageService(
                    httpClient,
                    sp.GetRequiredService<IAmazonS3>(),
                    config["AWS:BucketName"]!,
                    sp.GetRequiredService<IConfiguration>(),
                    sp.GetRequiredService<ILogger<S3FileStorageService>>()
                );
            });

            return services;
        }
    }
}
