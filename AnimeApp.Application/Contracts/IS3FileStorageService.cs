namespace AnimeApp.Application.Contracts
{
    public interface IS3FileStorageService
    {
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string folder);
        public string GetUrl(string key);
    }
}