using System.Text.Json.Serialization;

namespace AnimeApp.Infrastructure.ExternalApi.MoonAPI.Dto
{
    public class MoonTegsResponse
    {
        [JsonPropertyName("status")]
        public string Status { get; set; } = null!;

        [JsonPropertyName("data")]
        public List<MoonTegResponse> Tags { get; set; } = [];
    }

    public class MoonTegResponse
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string NameEn { get; set; } = null!;

        [JsonPropertyName("name_ua")]
        public string NameUa { get; set; } = null!;

        [JsonPropertyName("slug")]
        public string Slug { get; set; } = null!;
    }
}
