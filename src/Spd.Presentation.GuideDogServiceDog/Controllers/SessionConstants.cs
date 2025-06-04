namespace Spd.Presentation.GuideDogServiceDog.Controllers;

public static class SessionConstants
{
    public static readonly string AnonymousRequestDataProtectorName = "GDSDAnonymousSubmitRequest";
    public static readonly string AnonymousApplicationContext = "GDSDApplicationContext"; //used for anonymous update/renew/replace, get application content
    public static readonly string AnonymousApplicationSubmitKeyCode = "GDSDApplicationSubmitKeyCode";
    public static readonly string AnonymousApplicantContext = "GDSDApplicantContext"; //used for anonymous update for applicant
}
