using System.Text.Json;
using System.Text.Json.Serialization;

namespace AnimeApp.Infrastructure.Converters
{
    public class NullableIntFromStringConverter : JsonConverter<int?>
    {
        public override int? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Number)
                return reader.GetInt32();

            if (reader.TokenType == JsonTokenType.String)
            {
                var str = reader.GetString();

                if (int.TryParse(str, out var value))
                    return value;
            }

            return null;
        }

        public override void Write(Utf8JsonWriter writer, int? value, JsonSerializerOptions options)
        {
            if (value.HasValue)
                writer.WriteNumberValue(value.Value);
            else
                writer.WriteNullValue();
        }
    }
}
