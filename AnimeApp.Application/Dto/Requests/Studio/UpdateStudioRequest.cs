namespace AnimeApp.Application.Dto.Requests.Studio
{
    public record UpdateStudioRequest(
       string? Name,
       int? MalId,
       string? Slug,
       string? Description
    );
}
