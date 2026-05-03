namespace AnimeApp.Application.Contracts.Infra
{
    public interface IS3FileStorageService
    {
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string folder);
        public string GetUrl(string key);
    }
}