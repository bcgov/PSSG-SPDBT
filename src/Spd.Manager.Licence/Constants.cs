namespace Spd.Manager.Licence;
internal static class Constants
{
    internal const int LicenceReplaceValidBeforeExpirationInDays = 14;
    internal const int LicenceWith123YearsRenewValidBeforeExpirationInDays = 90;
    internal const int LicenceWith90DaysRenewValidBeforeExpirationInDays = 60;
    internal const int LicenceUpdateValidBeforeExpirationInDays = 14;//Licence holder can't request an update within 14 days of expiry date
    internal const int MaximumNumberOfUserEnteredAliases = 10;
}
