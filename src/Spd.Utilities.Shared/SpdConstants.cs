using System.Net.NetworkInformation;

namespace Spd.Utilities.Shared;
public static class SpdConstants
{
    public static readonly int USER_INVITE_VALID_DAYS = 7;
    public static readonly int APPLICATION_INVITE_VALID_DAYS = 14;
    public static readonly string BULK_APP_UPLOAD_FILE_EXTENSION = ".tsv";
    public static readonly long UPLOAD_FILE_MAX_SIZE = 26214400; //25M
    public static readonly string BULK_APP_UPLOAD_COL_SEPARATOR = "\"\t\"";
    public static readonly string BULK_APP_UPLOAD_BIRTHDATE_FORMAT = "yyyy-MM-dd";
    public static readonly string DEFAULT_BANNER_MSG = "10 business days for online applications and 20 business days for manual applications.";
    public static readonly string BANNER_MSG_CONFIG_KEY = "ScreeningPortalProcessingTimeBanner";
    public static readonly string USER_INVITE_LINK = "crrp/invitation/";
    public static readonly string APPLICATION_INVITE_LINK = "crca/invitation/";
    public static readonly int SHAREABLE_CLEARANCE_EXPIRED_DATE_BUFFER_IN_MONTHS = 6;
    public static readonly string[] VALID_UPLOAD_FILE_EXE = { ".docx",".doc",".bmp",".jpeg",".jpg",".tif",".tiff",".png",".gif",".pdf",".html",".htm" };
}
