using System.Globalization;

namespace Spd.Utilities.Shared.Tools;

public static class StringHelper
{
    public static string ToTitleCase(string? str)
    {
        if (str == null) return null;
        TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
        return textInfo.ToTitleCase(str.ToLower());
    }
}

