using Amazon.Runtime;
using Amazon.S3;
using AnimeApp.Application.Contracts;
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

            services.AddSingleton<IS3FileStorageService>(sp =>
                new S3FileStorageService(
                    sp.GetRequiredService<IAmazonS3>(),
                    config["AWS:BucketName"],
                    sp.GetRequiredService<IConfiguration>()
                ));

            return services;
        }
    }
}
