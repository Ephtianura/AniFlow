using Microsoft.AspNetCore.Http;

namespace AnimeApp.Application.Dto.Requests.Studio
{
    public class CreateStudioRequest
    {
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
    }
}
