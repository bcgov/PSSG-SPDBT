using System.Globalization;

namespace Spd.Utilities.Shared.Tools;
public static class StringHelper
{
    public static string? ToTitleCase(string? str)
    {
        if (string.IsNullOrEmpty(str)) return null;
        return CultureInfo.InvariantCulture.TextInfo.ToTitleCase(str.ToLower());
    }

    public static string? SanitizeEmpty(string? str)
    {
        if (string.IsNullOrEmpty(str)) return null;
        return str;
    }

    public static string SanitizeNull(string? text)
    { return text ?? string.Empty; }

    public static string Truncate(string input, int maxLength)
    {
        if (string.IsNullOrEmpty(input)) return input;
        return input.Length <= maxLength ? input : input.Substring(0, maxLength);
    }
}