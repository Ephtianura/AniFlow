using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Responses.Anime
{
    public class TitleResponse
    {
        public int Id { get; set; }
        public string Value { get; set; } = string.Empty;
        public TitleLanguage Language { get; set; }      
        public TitleType Type { get; set; }
    }
}