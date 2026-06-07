using Microsoft.AspNetCore.Http;

namespace AnimeApp.Application.Dto.Requests
{
    public class UploadFileRequest
    {
        public IFormFile File { get; set; } = default!;
    }
}
