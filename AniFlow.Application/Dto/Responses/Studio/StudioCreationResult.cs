using AniFlow.Application.Dto.Requests.Studio;

namespace AniFlow.Application.Dto.Responses.Studio
{
    public class StudioCreationResult
    {
        public Core.Models.Studio? Studio { get; set; }
        public CreateStudioRequest? Request { get; set; }
        public string? Error { get; set; }
    }
}