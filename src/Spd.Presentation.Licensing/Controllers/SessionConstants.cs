namespace Spd.Presentation.Licensing.Controllers;

public static class SessionConstants
{
    public static readonly string AnonymousRequestDataProtectorName = "AppAnonymousSubmitRequest";
    public static readonly string AnonymousApplicationContext = "LicenceApplicationContext"; //used for anonymous update/renew/replace, get application content
    public static readonly string AnonymousApplicationSubmitKeyCode = "LicenceApplicationSubmitKeyCode";
    public static readonly string AnonymousSoleProprietorApplicationContext = "SoleProprietorApplicationContext"; //used for unauth sole proprietor, biz abort the app
    public static readonly string AnonymousApplicantContext = "ApplicantContext"; //used for anonymous update for applicant
}
