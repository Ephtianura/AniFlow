namespace AnimeApp.Application.Dto.Requests.Studio
{
    public class CreateStudioRequest
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}
