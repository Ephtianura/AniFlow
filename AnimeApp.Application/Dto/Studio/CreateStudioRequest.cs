using Microsoft.AspNetCore.Http;

namespace AnimeApp.Application.Dto.Studio
{
    public class CreateStudioRequest
    {
        public string Name { get; set; } = "";
        public IFormFile? Poster { get; set; }
        public string Description { get; set; } = "";
    }
}
