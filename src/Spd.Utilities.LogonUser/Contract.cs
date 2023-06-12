namespace Spd.Utilities.LogonUser;
public class ApplicantIdentityInfo
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    public string? Email { get; set; }
    public string? Gender { get; set; }
    public string? Age { get; set; }
    public string? Sub { get; set; }
    public string? BirthDate { get; set; }
    public bool? EmailVerified { get; set; }
    public string? Issuer { get; set; }
}

public class PortalUserIdentityInfo
{
    public string? BCeIDUserName { get; set; }
    public string? DisplayName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PreferredUserName { get; set; }
    public Guid? UserGuid { get; set; }
    public Guid BizGuid { get; set; }
    public string? BizName { get; set; }
    public string? Issuer { get; set; }
    public bool? EmailVerified { get; set; }
    public string? Email { get; set; }
}
