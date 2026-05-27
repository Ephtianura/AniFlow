using AnimeApp.Application.Dto.Responses.Anime;

namespace AnimeApp.Application.Dto.Responses.Studio
{
    public class StudioResponse
    {
        public int Id { get; set; }
        public int? MalId { get; set; }
        public string Slug { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public string? PosterUrl { get; set; }
        public List<AnimesResponse> Animes { get; set; } = [];
    }

    public class StudiosResponse
    {
        public int Id { get; set; }
        public int? MalId { get; set; }
        public string Slug { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public string? PosterUrl { get; set; }
    }
}
