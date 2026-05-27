using System.Text.Json.Serialization;

namespace AnimeApp.Infrastructure.ExternalApi.MoonAPI.Dto
{
    public class MoonEpisodeDto
    {
        [JsonPropertyName("episode")]
        public int? Episode { get; set; }

        [JsonPropertyName("video_url")]
        public string VideoUrl { get; set; } = null!;

        [JsonPropertyName("poster")]
        public string? Poster { get; set; }

        [JsonPropertyName("date")]
        public DateTime Date { get; set; }

        [JsonPropertyName("subtitles")]
        public bool Subtitles { get; set; }
    }

    /// <summary>
    /// API повертає Dictionary, де ключ назва озвучки
    /// {
    /// "Озвучка 1": [ { episode: 1, "video_url": "" } ],
    /// "Озвучка 2": [ { episode: 2, "video_url": "" } ]
    /// }
    /// </summary>
}
