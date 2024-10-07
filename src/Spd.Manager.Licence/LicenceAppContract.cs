using Spd.Manager.Shared;
using GenderCode = Spd.Manager.Shared.GenderCode;

namespace Spd.Manager.Licence;

public record PersonalLicenceAppBase : LicenceAppBase
{
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public GenderCode? GenderCode { get; set; }
    public bool? OneLegalName { get; set; }
    public Guid? ExpiredLicenceId { get; set; } //for new application type, for renew, replace, update, it should be null.
    public bool? HasExpiredLicence { get; set; }  //for new application type
    public bool? HasCriminalHistory { get; set; }
    public bool? HasPreviousName { get; set; }
    public IEnumerable<Alias>? Aliases { get; set; }
    public bool? HasBcDriversLicence { get; set; }
    public string? BcDriversLicenceNumber { get; set; }
    public HairColourCode? HairColourCode { get; set; }
    public EyeColourCode? EyeColourCode { get; set; }
    public int? Height { get; set; }
    public HeightUnitCode? HeightUnitCode { get; set; }
    public int? Weight { get; set; }
    public WeightUnitCode? WeightUnitCode { get; set; }
    public string? EmailAddress { get; set; }
    public string? PhoneNumber { get; set; }
    public bool? IsMailingTheSameAsResidential { get; set; }
    public ResidentialAddress? ResidentialAddress { get; set; }
    public MailingAddress? MailingAddress { get; set; }
    public bool? IsCanadianCitizen { get; set; }
    public bool? AgreeToCompleteAndAccurate { get; set; }
    public bool? HasLegalNameChanged { get; set; }
    public IEnumerable<DocumentExpiredInfo> DocumentExpiredInfos { get; set; } = Enumerable.Empty<DocumentExpiredInfo>();
    public bool? HasNewCriminalRecordCharge { get; set; }
}

public record ResidentialAddress : Address;
public record MailingAddress : Address;
public record DocumentExpiredInfo
{
    public LicenceDocumentTypeCode LicenceDocumentTypeCode { get; set; }
    public DateOnly? ExpiryDate { get; set; }
}
public record LicenceAppUpsertResponse
{
    public Guid? LicenceAppId { get; set; }
}
public record LicenceAppBase
{
    public ServiceTypeCode? ServiceTypeCode { get; set; }
    public ApplicationTypeCode? ApplicationTypeCode { get; set; }
    public LicenceTermCode? LicenceTermCode { get; set; } //for biz licence term, only 1,2,3 year
    public BizTypeCode? BizTypeCode { get; set; }
    public ApplicationOriginTypeCode ApplicationOriginTypeCode { get; set; } = ApplicationOriginTypeCode.Portal;
}