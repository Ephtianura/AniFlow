using Microsoft.AspNetCore.Http;

namespace AnimeApp.Application.Services
{
    public partial class StudioService
    {
        public record UpdateStudioRequest(
           string? Name,
           IFormFile? Poster,
           string? Description = ""

           );
    }
}
