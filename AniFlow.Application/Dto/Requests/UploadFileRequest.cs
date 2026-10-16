using Microsoft.AspNetCore.Http;

namespace AniFlow.Application.Dto.Requests
{
    public class UploadFileRequest
    {
        public IFormFile File { get; set; } = default!;
    }
}
