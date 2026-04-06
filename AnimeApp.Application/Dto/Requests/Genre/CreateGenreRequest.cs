namespace AnimeApp.Application.Dto.Requests.Genre
{
    public record CreateGenreRequest(
        string NameEn,
        string? NameUa,
        string? NameRu
        );
}
