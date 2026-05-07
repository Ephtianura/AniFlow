using AnimeApp.Application.Dto.Requests.Anime;
using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Responses.Anime
{
    /// <summary>
    /// Dto, яке відображає масив із аніме, які користувач додав до свого власного списку.
    /// </summary>
    public class AnimeInListResponse
    {
        public int Id { get; set; }
        public string Url { get; set; } = null!;
        public List<AnimeTitleRequest>? Titles { get; set; } = [];
        public double Score { get; set; }
        public int? MyRating { get; set; }
        public int TotalScores { get; set; }
        public int? Episodes { get; set; }
        public AnimeKindEnum? Kind { get; set; }
        public string? PosterFileName { get; set; }
    }
}