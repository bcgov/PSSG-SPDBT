using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public abstract record BizLicenceAppBase
{
    public ApplicationTypeCode? ApplicationTypeCode { get; set; }
    public string? ExpiredLicenceNumber { get; set; }
    public bool? HasExpiredLicence { get; set; }  //for new application type
    public BusinessTypeCode? BusinessTypeCode { get; set; }
    public string? BusinessLicenceNumber { get; set; }
    public string? LegalBusinessName { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public SecurityWorkerInfo? SecurityWorkerInfo { get; set; }     // * might not be needed in request
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }

    // Branding
    public IEnumerable<Document>? DocumentsBranding { get; set; }    // What kind of field do we need for "Document"?

    // Proof of insurance
    public Document? Insurnace { get; set; }   // What kind of document?

    // Licence category
    public IEnumerable<WorkerCategoryTypeCode> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeCode>();
    public IEnumerable<Document>? DocumentsRegistrar { get; set; }    // What kind of field do we need for "Document"?
    public PrivateInvestigatorInfo? PrivateInvestigatorInfo { get; set; }
    public bool? UseDogs { get; set; }
    public Document? SecurityDogCertificate { get; set; }

    // Licence term
    public LicenceTermCode? LicenceTermCode { get; set; }

    // Business manager info
    public BusinessManagerInfo? BusinessManagerInfo { get; set; }
    public BusinessManagerInfo? OtherContactInfo { get; set; }

    // Business address
    public bool? IsMailingTheSameAsBusiness { get; set; }
    public BusinessAddress? BusinessAddress { get; set; }
    public BusinessMailingAddress? BusinessMailingAddress { get; set; }
    public BcAddress? BcAddress { get; set; }

    // Branches
    public IEnumerable<BusinessAddress> BranchOffices { get; set; } = Enumerable.Empty<BusinessAddress>();

    // Controlling member
    public ControllerMemberInfo? ControllerMemberInfo { get; set; }
    public IEnumerable<SwlControllerMemberInfo> SwlControllerMemberInfos { get; set; } = Enumerable.Empty<SwlControllerMemberInfo>();
    public IEnumerable<NonSwlControllerMemberInfo> NonSwlControllerMemberInfos { get; set; } = Enumerable.Empty<NonSwlControllerMemberInfo>();
    public Document? BcReport { get; set; }

    // Employees
    public IEnumerable<Employee> Employees { get; set; } = Enumerable.Empty<Employee>();
}

public record SecurityWorkerInfo : PersonalInfo
{
    public string? LicenceNumber { get; set; }  //security worker licence number
    public bool? IsLicenceValid { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
}

public record PrivateInvestigatorInfo : PersonalInfo
{
    public string? ManagerLicenceNumber { get; set; }
}

public record BusinessManagerInfo : PersonalInfo
{
    public bool? IsBusinessManager { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
}

public record PersonalInfo
{
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
}

public record BusinessAddress : Address;
public record BusinessMailingAddress : Address;
public record BcAddress : Address;

public record BranchInfo : Address
{
    public string? BranchManager { get; set; }
    public string? ManagerEmail { get; set; }
    public string? ManagerPhoneNumber { get; set; }
}

public record ControllerMemberInfo
{
    public string? Name { get; set; }
    public string? SecurityWorkerLicenceNumber { get; set; }
    public LicenceStatusCode? Status { get; set; }
}

public record SwlControllerMemberInfo : PersonalInfo
{
    public string? SecurityWorkerLicenceNumber { get; set; }
}

public record NonSwlControllerMemberInfo : PersonalInfo
{
    public string? EmailAddress { set; get; }
}

public record Employee : PersonalInfo
{
    public string? SecurityWorkerLicenceNumber { get; set; }
}

public record BizLicenceAppSubmitRequest : BizLicenceAppBase
{

}