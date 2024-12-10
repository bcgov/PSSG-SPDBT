using TimeZoneConverter;

namespace Spd.Utilities.Shared.Tools;

public static class DateOnlyHelper
{
    public static DateTimeOffset ToDateTimeOffset(this DateOnly dateOnly, TimeZoneInfo zone)
    {
        var dateTime = dateOnly.ToDateTime(new TimeOnly(0));
        return new DateTimeOffset(dateTime, zone.GetUtcOffset(dateTime));
    }

    public static DateOnly ToDateOnly(this DateTimeOffset dto, TimeZoneInfo zone)
    {
        var inTargetZone = TimeZoneInfo.ConvertTime(dto, zone);
        return DateOnly.FromDateTime(inTargetZone.Date);
    }

    public static DateOnly GetCurrentPSTDate()
    {
        string tzId = GetPlatformSpecificTimeZoneId("Pacific Standard Time");
        return DateTimeOffset.UtcNow.ToDateOnly(TimeZoneInfo.FindSystemTimeZoneById(tzId));
    }

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

