﻿namespace Spd.Resource.Repository;
public enum PayerPreferenceTypeCode
{
    Organization,
    Applicant
}

public record Paging(int Page, int PageSize);
public record PaginationResp
{
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
    public int Length { get; set; }
}
public enum EmployeeOrganizationTypeCode
{
    Childcare,
    Healthcare,
    Education,
    Funding,
    CrownCorp,
    ProvGovt,
    Registrant,
    GovnBody,
    Appointed
}

public enum VolunteerOrganizationTypeCode
{
    NonProfit,
    Childcare,
    Healthcare,
    Education,
    ProvFunded,
    CrownCorp,
    ProvGovt,
    Registrant,
    Municipality,
    PostSec,
}

public enum BooleanTypeCode
{
    Yes,
    No
}

public enum EmployeeInteractionTypeCode
{
    Children,
    Adults,
    ChildrenAndAdults,
    Neither
}

public enum ServiceTypeEnum
{
    PSSO,
    CRRP_EMPLOYEE,
    CRRP_VOLUNTEER,
    MCFD,
    PE_CRC,
    PE_CRC_VS,
    SecurityWorkerLicence,
    PSSO_VS,
    SECURITY_BUSINESS_LICENCE,
    ArmouredVehiclePermit,
    BodyArmourPermit,
    MDRA,
    SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC
}

public enum GenderEnum
{
    M,
    F,
    U
}

public record MailingAddr() : Addr;
public record ResidentialAddr() : Addr;
public abstract record Addr
{
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public string? Province { get; set; }
}
public record Alias
{
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }

}
public enum ApplicationTypeEnum
{
    New,
    Renewal,
    Replacement,
    Update,
}

public enum LicenceTermEnum
{
    NinetyDays,
    OneYear,
    TwoYears,
    ThreeYears,
    FiveYears
}