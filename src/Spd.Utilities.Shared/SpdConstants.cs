namespace Spd.Utilities.Shared;
public static class SpdConstants
{
    public static readonly int USER_INVITE_VALID_DAYS = 7;
    public static readonly int APPLICATION_INVITE_VALID_DAYS = 14;
    public static readonly string BULK_APP_UPLOAD_FILE_EXTENSTION = ".tsv";
    public static readonly long UPLOAD_FILE_MAX_SIZE = 26214400; //25M
    public static readonly string BULK_APP_UPLOAD_COL_SEPERATOR = "\"\t\"";
    public static readonly string BULK_APP_UPLOAD_BIRTHDATE_FORMAT = "yyyy-MM-dd";
    public static readonly string DEFAULT_BANNER_MSG = "10 business days for online applications and 20 business days for manual applications.";
    public static readonly string BANNER_MSG_CONFIG_KEY = "ScreeningPortalProcessingTimeBanner";
}
