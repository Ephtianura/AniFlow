using AnimeApp.Application.Dto.Requests.Studio;

namespace AnimeApp.Application.Dto.Responses.Studio
{
    public class StudioCreationResult
    {
        public Core.Models.Studio? Studio { get; set; }
        public CreateStudioRequest? Request { get; set; }
        public string? Error { get; set; }
    }
}