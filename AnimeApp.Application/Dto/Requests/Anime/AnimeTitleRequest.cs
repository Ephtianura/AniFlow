using AnimeApp.Core.Enums;

namespace AnimeApp.Application.Dto.Requests.Anime
{
    public class AnimeTitleRequest
    {
        public string Value { get; set; } = string.Empty;
        public TitleLanguage Language { get; set; }
        public TitleType Type { get; set; }

        public override string ToString()
        {
            return $"Value={Value}, Language={Language}, Type={Type}";
        }
    }


}