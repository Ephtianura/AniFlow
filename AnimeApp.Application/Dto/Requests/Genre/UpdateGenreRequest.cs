namespace AnimeApp.Application.Dto.Requests.Genre
{
    public record UpdateGenreRequest(
        string? NameEn,
        string? NameUa,
        string? NameRu
        );
}
