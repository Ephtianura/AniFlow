namespace AnimeApp.Application.Dto.Requests.Studio
{
    public record UpdateStudioRequest(
       string? Name,
       string? MalId,
       string? Slug,
       string? Description = ""
       );
}
