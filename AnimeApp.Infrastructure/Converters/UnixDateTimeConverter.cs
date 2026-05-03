using System.Text.Json;
using System.Text.Json.Serialization;

namespace AnimeApp.Infrastructure.Converters
{
    public class UnixDateTimeConverter : JsonConverter<DateTime?>
    {
        public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Null)
                return null;

            if (reader.TokenType == JsonTokenType.Number)
            {
                if (reader.TryGetInt64(out long value))
                {
                    if (value <= 0)
                        return null;

                    return DateTimeOffset.FromUnixTimeSeconds(value).UtcDateTime;
                }
            }

            if (reader.TokenType == JsonTokenType.String)
            {
                var str = reader.GetString();

                if (string.IsNullOrWhiteSpace(str))
                    return null;

                if (!long.TryParse(str, out var value) || value <= 0)
                    return null;

                return DateTimeOffset.FromUnixTimeSeconds(value).UtcDateTime;
            }

            return null;
        }

        public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
        {
            if (value is null)
            {
                writer.WriteNullValue();
                return;
            }

            var unix = ((DateTimeOffset)value.Value).ToUnixTimeSeconds();
            writer.WriteNumberValue(unix);
        }
    }
}
