using AnimeApp.Core.Enums;
using AnimeApp.Core.Models;
using AnimeApplication.Core.Enums;

namespace AnimeApp.API.Dto
{
    public record AnimesResponse
    {
        public int Id { get; set; }

        public List<AnimeTitle> Titles { get; set; }
        public string Url { get; set; } = string.Empty;

        public string? PosterUrl { get; set; }

        public DateTime? AiredOn { get; set; }
        public DateTime? ReleasedOn { get; set; }

        public double Score { get; set; }
        public int Episodes { get; set; }
        public SeasonEnum Season { get; set; }
        public int Year { get; set; }

        public AnimeRatingEnum Rating { get; set; }
        public AnimeKindEnum Kind { get; set; }
        public AnimeStatusEnum Status { get; set; }

        public string Description { get; private set; } = string.Empty;


        public List<Genre> Genres { get; set; } = new();


    }
}
