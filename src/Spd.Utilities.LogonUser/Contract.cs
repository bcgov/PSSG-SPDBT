namespace Spd.Utilities.LogonUser;
public class BcscIdentityInfo
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    public string? Email { get; set; }
    public string? Gender { get; set; }
    public string? Age { get; set; }
    public string Sub { get; set; } = null!;
    public DateOnly BirthDate { get; set; }
    public bool? EmailVerified { get; set; }
    public string? Issuer { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Address { get; set; }
}

public class BceidIdentityInfo
{
    public string? BCeIDUserName { get; set; }
    public string? DisplayName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PreferredUserName { get; set; }
    public Guid? UserGuid { get; set; }
    public Guid? BizGuid { get; set; }
    public string? BizName { get; set; }
    public string? Issuer { get; set; }
    public bool? EmailVerified { get; set; }
    public string? Email { get; set; }
}

public class IdirUserIdentityInfo
{
    public string? IdirUserName { get; set; } //idir_username
    public string? DisplayName { get; set; } //display_name
    public string? FirstName { get; set; } //given_name
    public string? LastName { get; set; } //family_name
    public string? PreferredUserName { get; set; } //preferred_username
    public string? UserGuid { get; set; } //idir_user_guid
    public string? UserName { get; set; } //idir_username
    public string? Issuer { get; set; } //iss
    public bool? EmailVerified { get; set; } //email_verified
    public string? Email { get; set; } //email
}
