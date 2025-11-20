namespace AnimeApp.Application.Services
{
    public partial class GenreService
    {
        public record CreateGenreRequest(
            string NameEn,
            string? NameUa,
            string? NameRu
            );
    }
}
