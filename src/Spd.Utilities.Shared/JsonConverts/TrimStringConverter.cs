using System.Text.Json;
using System.Text.Json.Serialization;

namespace Spd.Utilities.Shared.JsonConverts;
public class TrimStringConverter : JsonConverter<string?>
{
    public override string? Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options)
    {
        return reader.GetString()?.Trim();
    }

    public override void Write(
        Utf8JsonWriter writer,
        string? value,
        JsonSerializerOptions options)
    {
        writer.WriteStringValue(value);
    }
}
