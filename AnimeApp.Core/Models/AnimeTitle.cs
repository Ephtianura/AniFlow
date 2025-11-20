using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Models
{
    public class AnimeTitle
    {
        private AnimeTitle() { }
        private AnimeTitle(int animeId, string value, TitleLanguage language, TitleType type)
        {
            AnimeId = animeId;
            Value = value;
            Language = language;
            Type = type;
        }
        public int Id { get; private set; }
        public int AnimeId { get; private set; }
        public string Value { get; private set; }
        public TitleLanguage Language { get; private set; }      // Enum: Romaji, Ukrainian, Russian, English…
        public TitleType Type { get; private set; }              // Enum: Official, Fan, Abbreviation…

        public static AnimeTitle Create(string value, TitleLanguage language, TitleType type)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Value cannot be empty", nameof(value));

            return new AnimeTitle(0, value, language, type); // EF подхватит AnimeId
        }


        public void ChangeValue(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Value cannot be empty", nameof(value));

            Value = value;
        }

        public void ChangeLanguage(TitleLanguage language)
        {
            Language = language;
        }

        public void ChangeType(TitleType type)
        {
            Type = type;
        }

    }
}
