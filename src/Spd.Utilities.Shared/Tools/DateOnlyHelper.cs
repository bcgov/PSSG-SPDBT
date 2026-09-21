namespace Spd.Utilities.Shared.Tools;

public static class DateOnlyHelper
{
    /// <summary>
    /// Gets the current date in the Pacific Time (PCT) zone.
    /// </summary>
    /// <returns>The current date in the Pacific Time (PCT) zone.</returns>
    public static DateOnly GetCurrentPCTDate()
    {
        var tzId = GetPlatformSpecificTimeZoneId("America/Vancouver");

        var zone = TimeZoneInfo.FindSystemTimeZoneById(tzId);

        var localDateTime = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, zone);

        return DateOnly.FromDateTime(localDateTime.Date);
    }

    /// <summary>
    /// Gets the platform-specific time zone ID based on the provided Windows time zone ID.
    /// </summary>
    /// <param name="windowsTimeZoneId">The Windows time zone ID to convert.</param>
    /// <returns>The platform-specific time zone ID.</returns>
    private static string GetPlatformSpecificTimeZoneId(string windowsTimeZoneId)
    {
        if (OperatingSystem.IsWindows())
        {
            return windowsTimeZoneId; // Use Windows time zone ID
        }
        else
        {
            // Convert Windows time zone ID to IANA time zone ID for non-Windows platforms
            return TZConvert.WindowsToIana(windowsTimeZoneId);
        }
    }
}
