using AnimeApp.Infrastructure.Converters;
using System.Text.Json.Serialization;

namespace AnimeApp.Infrastructure.ExternalApi.MoonAPI.Dto
{
    public class MoonApiAnimeFullResponse
    {
        [JsonPropertyName("mal_id")]
        public int MalId { get; set; }

        [JsonPropertyName("anilist_id")]
        [JsonConverter(typeof(NullableIntFromStringConverter))]
        public int? AnilistId { get; set; }

        [JsonPropertyName("data_type")]
        public string? DataType { get; set; }

        [JsonPropertyName("companies")]
        public List<MoonCompanyWrapperDto> Companies { get; set; } = [];

        [JsonPropertyName("genres")]
        public List<MoonGenreDto> Genres { get; set; } = [];

        [JsonPropertyName("start_date")]
        [JsonConverter(typeof(UnixDateTimeConverter))]
        public DateTime? StartDate { get; set; }

        [JsonPropertyName("end_date")]
        [JsonConverter(typeof(UnixDateTimeConverter))]
        public DateTime? EndDate { get; set; }

        [JsonPropertyName("episodes_released")]
        public int? EpisodesReleased { get; set; }

        [JsonPropertyName("episodes_total")]
        public int? EpisodesTotal { get; set; }

        [JsonPropertyName("synopsis_en")]
        public string? SynopsisEn { get; set; }

        [JsonPropertyName("synopsis_ua")]
        public string? SynopsisUa { get; set; }

        [JsonPropertyName("media_type")]
        public string? MediaType { get; set; }

        [JsonPropertyName("title_ua")]
        public string? TitleUa { get; set; }

        [JsonPropertyName("title_en")]
        public string? TitleEn { get; set; }

        [JsonPropertyName("title_ja")]
        public string? TitleJa { get; set; }

        [JsonPropertyName("synonyms")]
        public List<string> Synonyms { get; set; } = [];

        [JsonPropertyName("duration")]
        public int? Duration { get; set; }

        [JsonPropertyName("image")]
        public string? Image { get; set; }

        [JsonPropertyName("status")]
        public string? Status { get; set; } // "finished"

        [JsonPropertyName("source")]
        public string? Source { get; set; } // "manga", "ranobe"

        [JsonPropertyName("rating")]
        public string? Rating { get; set; } // "pg_13"

        [JsonPropertyName("score")]
        public double? Score { get; set; } // 9.73
        
        [JsonPropertyName("season")]
        public string? Season { get; set; } // "spring", "winter"

        [JsonPropertyName("year")]
        public int? Year { get; set; } // 2022

        [JsonPropertyName("nsfw")]
        public bool Nsfw { get; set; }

        [JsonPropertyName("slug")]
        public string? Slug { get; set; } // "oshi-no-ko-421060"


        [JsonPropertyName("external")]
        public List<MoonExternalLinkDto> External { get; set; } = [];

        [JsonPropertyName("videos")]
        public List<MoonVideoDto> Videos { get; set; } = [];

        [JsonPropertyName("ost")]
        public List<MoonOstDto> Ost { get; set; } = [];
    }


    public class MoonCompanyWrapperDto
    {
        [JsonPropertyName("type")]
        public string? Type { get; set; }

        [JsonPropertyName("company")]
        public MoonCompanyDto? Company { get; set; }
    }
    public class MoonCompanyDto
    {
        [JsonPropertyName("image")]
        public string? Image { get; set; }

        [JsonPropertyName("slug")]
        public string? Slug { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }
    }
    public class MoonGenreDto
    {
        [JsonPropertyName("name_ua")]
        public string? NameUa { get; set; }

        [JsonPropertyName("name_en")]
        public string? NameEn { get; set; }

        [JsonPropertyName("slug")]
        public string? Slug { get; set; }

        [JsonPropertyName("type")]
        public string? Type { get; set; }
    }
    public class MoonExternalLinkDto
    {
        [JsonPropertyName("url")]
        public string? Url { get; set; }

        [JsonPropertyName("text")]
        public string? Text { get; set; }

        [JsonPropertyName("type")]
        public string? Type { get; set; }
    }
    public class MoonVideoDto
    {
        [JsonPropertyName("url")]
        public string? Url { get; set; }

        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("video_type")]
        public string? VideoType { get; set; }
    }
    public class MoonOstDto
    {
        [JsonPropertyName("index")]
        public int Index { get; set; }

        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [JsonPropertyName("author")]
        public string? Author { get; set; }

        [JsonPropertyName("spotify")]
        public string? Spotify { get; set; }

        [JsonPropertyName("ost_type")]
        public string? OstType { get; set; }
    }

}
