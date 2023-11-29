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
}

