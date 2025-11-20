namespace AnimeApp.Application.Services
{
    public partial class GenreService
    {
        public record UpdateGenreRequest(
            string? NameEn, 
            string? NameUa, 
            string? NameRu
            );
    }
}
