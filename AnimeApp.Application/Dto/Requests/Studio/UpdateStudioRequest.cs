namespace AnimeApp.Application.Dto.Requests.Studio
{
    public record UpdateStudioRequest(
       string? Name,
       string? Description = ""
       );
}
