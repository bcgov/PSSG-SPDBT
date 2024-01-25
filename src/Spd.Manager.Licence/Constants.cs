namespace Spd.Manager.Licence;
internal class Constants
{
    public static readonly int LICENCE_REPLACE_VALID_BEFORE_EXPIRATION_IN_DAYS = 14;
    public static readonly int LICENCE_RENEW_VALID_BEFORE_EXPIRATION_IN_DAYS = 90;
    public static readonly int LICENCE_UPDATE_VALID_BEFORE_EXPIRATION_IN_DAYS = 14;//Licence holder can't request an update within 14 days of expiry date
}
