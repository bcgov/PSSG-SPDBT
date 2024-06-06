namespace Spd.Utilities.Shared;
public static class SpdConstants
{
    public static readonly Guid BcGovOrgId = Guid.Parse("720dbb43-0a37-ee11-b845-00505683fbf4");
    public static readonly int UserInviteValidDays = 7;
    public static readonly int ApplicationInviteValidDays = 14;
    public static readonly int PrePaymentLinkValidDays = 15;
    public static readonly string[] BulkAppUploadFileExtensions = { "tsv", "txt" };
    public static readonly long UploadFileMaxSize = 26214400; //25M
    public static readonly string BulkAppUploadColSeperator = "\t";
    public static readonly string BulkAppUploadBirthdateFormat = "yyyy-MM-dd";
    public static readonly string DefaultBannerMsg = "10 business days for online applications and 20 business days for manual applications.";
    public static readonly string UserInviteLink = "crrp/invitation/";
    public static readonly string CrrpApplicationInviteLink = "crrpa/invitation/";
    public static readonly string PssoApplicationInviteLink = "pssoa/invitation/";
    public static readonly int ShareableClearanceExpiredDateBufferInMonths = 6;
    public static readonly string[] ValidUploadFileExe = { ".docx", ".doc", ".bmp", ".jpeg", ".jpg", ".tif", ".tiff", ".png", ".gif", ".pdf", ".html", ".htm" };
}
