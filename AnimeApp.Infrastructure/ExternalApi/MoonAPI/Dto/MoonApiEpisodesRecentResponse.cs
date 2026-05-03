using AnimeApp.Infrastructure.Converters;
using System.Text.Json.Serialization;

namespace AnimeApp.Infrastructure.ExternalApi.MoonAPI.Dto
{
    public class MoonApiEpisodesRecentResponse
    {
        [JsonPropertyName("data")]
        public List<MoonEpisodeRecentDto> Episodes { get; set; } = [];
    }

    public class MoonEpisodeRecentDto
    {
        [JsonPropertyName("date_published")]
        public DateTime DatePublished { get; set; }

        [JsonPropertyName("anime")]
        public MoonEpisodeAnimeDto Anime { get; set; } = null!;
    }

    public class MoonEpisodeAnimeDto
    {
        [JsonPropertyName("moon_id")]
        public int MoonId { get; set; }

        [JsonPropertyName("mal_id")]
        [JsonConverter(typeof(NullableIntFromStringConverter))]
        public int? MalId { get; set; }
    }
}
