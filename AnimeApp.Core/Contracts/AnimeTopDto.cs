namespace AnimeApp.Core.Contracts
{
    public record AnimeTopDto
    {
        public int AnimeId { get; init; }
        public string Title { get; init; } = null!;
        public string Slug { get; init; } = null!;
        public int TotalViews { get; init; }
    }
}