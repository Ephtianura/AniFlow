namespace AnimeApp.Application.Dto.Responses.Anime
{
    public class GenreResponse
    {
        public int Id { get; set; }
        public string NameEn { get; set; } = string.Empty;
        public string? NameUa { get; set; }
    }
}