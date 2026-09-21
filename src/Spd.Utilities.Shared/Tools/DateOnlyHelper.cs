namespace Spd.Utilities.Shared.Tools;

public static class DateOnlyHelper
{
    public static readonly string PacificTimeZoneId = "America/Vancouver";

    /// <summary>
    /// Gets the current date in the Pacific Time (PCT) zone.
    /// </summary>
    /// <returns>The current date in the Pacific Time (PCT) zone.</returns>
    public static DateOnly GetCurrentPCTDate()
    {
        var zone = TimeZoneInfo.FindSystemTimeZoneById(PacificTimeZoneId);

        var localDateTime = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, zone);

        return DateOnly.FromDateTime(localDateTime.Date);
    }
}
