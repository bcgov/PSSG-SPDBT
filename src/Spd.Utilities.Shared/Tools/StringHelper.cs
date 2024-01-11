using System.Globalization;

namespace Spd.Utilities.Shared.Tools;
public static class StringHelper
{
    public static string ToTitleCase(string? str)
    {
        if (str == null) return null;
        return CultureInfo.InvariantCulture.TextInfo.ToTitleCase(str.ToLower());
    }
}


