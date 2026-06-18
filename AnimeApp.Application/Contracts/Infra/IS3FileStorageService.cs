using AnimeApp.Application.Dto.External;

namespace AnimeApp.Application.Contracts.Infra
{
    public interface IS3FileStorageService
    {
        /// <summary> Завантажує файл у S3 </summary>
        /// <returns> Назва файлу в S3 </returns>
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string folder);

        /// <summary> Завантажує паралельно файли в S3 по urls </summary>
        /// <returns> Назви файлів у S3 </returns>
        Task<List<string>> UploadImagesFromUrlsAsync(IEnumerable<string> urls, string folder);

        /// <summary> Завантажує файл в S3 по url </summary>
        /// <returns> Назва файлів у S3 </returns>
        Task<string?> UploadImageFromUrlAsync(string url, string folder, CancellationToken ct = default, int maxRedirects = 3);

        /// <summary> Видаляє файли в S3 по відносних шляхах файлів</summary>
        /// <returns> Кількість успішно видалених файлів та помилок </returns>
        Task<S3DeleteResult> DeleteFilesAsync(IEnumerable<string> keys);

        /// <summary> Формує повний URL до файлу в сховищі. </summary>
        /// <param name="key"> Відносний шлях файлу в bucket. </param>
        /// <returns> Повний URL до файлу. </returns>
        public string GetUrl(string key);
    }
}