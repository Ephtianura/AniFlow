using AnimeApp.Infrastructure.Converters;
using System.Text.Json.Serialization;

namespace AnimeApp.Infrastructure.ExternalApi.MoonAPI.Dto
{
    public class MoonApiAnimeIdResponse
    {
        [JsonPropertyName("anime_list")]
        public List<MoonAnimeIdDto> AnimeList { get; set; } = [];

        [JsonPropertyName("last_page")]
        public int LastPage { get; set; }
    }

    public class MoonAnimeIdDto
    {
        [JsonPropertyName("id")]
        public int MoonId { get; set; }

        [JsonPropertyName("mal_id")]
        [JsonConverter(typeof(NullableIntFromStringConverter))]
        public int? MalId { get; set; }

        [JsonPropertyName("anilist_id")]
        [JsonConverter(typeof(NullableIntFromStringConverter))]
        public int? AnilistId { get; set; }
    }
}
