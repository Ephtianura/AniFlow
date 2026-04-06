using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Responses.Anime
{
    /// <summary>
    /// Дто, якек відображає масив (зазвичай) із аніме, які користувач додав до свого власного списку.
    /// </summary>
    public class AnimeInListResponse
    {
        public int Id { get; set; } = 0;
        public List<AnimeTitleRequest>? Titles { get; set; } = new();
        public double Score { get; set; } = 0;
        public int? MyRating { get; set; } 
        public int TotalScores { get; set; } = 0;
        public int Episodes { get; set; } = 0;
        public AnimeKindEnum Kind { get; set; } = AnimeKindEnum.Unknown;
        public string? PosterFileName { get; set; } = null;
        public string Url { get; set; } = string.Empty;
    }
}