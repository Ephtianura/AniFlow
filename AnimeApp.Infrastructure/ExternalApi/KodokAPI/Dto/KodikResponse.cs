using AnimeApp.Infrastructure.Converters;
using System.Text.Json.Serialization;

namespace AnimeApp.Infrastructure.ExternalApi.KodokAPI.Dto
{
    public class KodikResponse
    {
        [JsonPropertyName("results")]
        public List<KodikSearchInfo> Result { get; set; } = [];
    }
    public class KodikSearchInfo
    {
        [JsonPropertyName("id")]
        public string KodikId { get; set; } = null!;

        [JsonPropertyName("shikimori_id")]
        [JsonConverter(typeof(NullableIntFromStringConverter))]
        public int? ShikimoriId { get; set; }

        [JsonPropertyName("seasons")]
        public Dictionary<string, SeasonInfo> Season { get; set; } = null!;
    }

    public class SeasonInfo
    {
        [JsonPropertyName("link")]
        public string SeasonLink { get; set; } = null!;

        [JsonPropertyName("episodes")]
        public Dictionary<string, KodikEpisodeInfo> Episodes { get; set; } = null!;
    }

    public class KodikEpisodeInfo
    {
        [JsonPropertyName("link")]
        public string EpisodeLink { get; set; } = null!;

        [JsonPropertyName("screenshots")]
        public List<string> Screenshots { get; set; } = [];
    }
}




