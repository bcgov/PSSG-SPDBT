namespace Spd.Resource.Applicants.Application;

public interface IApplicationRepository
{
    public Task<Guid?> AddApplicationAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken cancellationToken);
    public Task<bool> CheckApplicationDuplicateAsync(SearchApplicationQry searchApplicationQry, CancellationToken cancellationToken);
    public Task<ApplicationListResp> QueryAsync(ApplicationListQry query, CancellationToken cancellationToken);
    public Task<ApplicationStatisticsResp> QueryApplicationStatisticsAsync(ApplicationStatisticsQry query, CancellationToken cancellationToken);
    public Task<bool> IdentityAsync(IdentityCmd cmd, CancellationToken ct);
}

//application list
public record ApplicationListQry
{
    public AppFilterBy? FilterBy { get; set; } //null means no filter
    public AppSortBy? SortBy { get; set; } //null means no sorting
    public Paging Paging { get; set; } = null!;
}
public record AppFilterBy(Guid OrgId)
{
    public IEnumerable<ApplicationPortalStatusCd>? ApplicationPortalStatus { get; set; }
    public string? NameOrEmailOrAppIdContains { get; set; }
}
public record AppSortBy(bool? SubmittedDateDesc = true, bool? NameDesc = null, bool? CompanyNameDesc = null);
public record SearchApplicationQry
{
    public Guid OrgId { get; set; }
    public string GivenName { get; set; }
    public string Surname { get; set; }
    public DateTimeOffset? DateOfBirth { get; set; }
}

//application create
public record ApplicationCreateCmd
{
    public Guid OrgId { get; set; }
    public ApplicationOriginTypeCode OriginTypeCode { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public string? EmailAddress { get; set; }
    public string? PhoneNumber { get; set; }
    public string? DriversLicense { get; set; }
    public DateTimeOffset? DateOfBirth { get; set; }
    public string? BirthPlace { get; set; }
    public string? JobTitle { get; set; }
    public string? ContractedCompanyName { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? PostalCode { get; set; }
    public string? Province { get; set; }
    public string? Country { get; set; }
    public bool? AgreeToCompleteAndAccurate { get; set; }
    public bool? HaveVerifiedIdentity { get; set; }
    public List<AliasCreateCmd> Aliases { get; set; }
    public Guid CreatedByUserId { get; set; }
    public PayerPreferenceTypeCode PayeeType { get; set; }
}
public record AliasCreateCmd
{
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }

}
public record IdentityCmd
{
    public Guid OrgId { get; set; }
    public Guid ApplicationId { get; set; }
    public bool Verify { get; set; }
}
public record ApplicationResult
{
    public Guid Id { get; set; }
    public Guid OrgId { get; set; }
    public string? ApplicationNumber { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public string? EmailAddress { get; set; }
    public string? JobTitle { get; set; }
    public PayerPreferenceTypeCode? PaidBy { get; set; }
    public DateTimeOffset? DateOfBirth { get; set; }
    public string? ContractedCompanyName { get; set; }
    public string ApplicationPortalStatus { get; set; } = null!;
    public string? CaseStatus { get; set; }
    public string? CaseSubStatus { get; set; }
    public bool? HaveVerifiedIdentity { get; set; }
    public DateTimeOffset? CreatedOn { get; set; }
}
public class ApplicationListResp
{
    public int? FollowUpBusinessDays { get; set; }
    public IEnumerable<ApplicationResult> Applications { get; set; } = Array.Empty<ApplicationResult>();
    public PaginationResp Pagination { get; set; } = null!;
}
public enum ApplicationOriginTypeCode
{
    Portal,
    Email,
    WebForm,
    Mail,
    Fax,
    GenericUpload,
    OrganizationSubmitted
}

//application statistics
public record ApplicationStatisticsQry(Guid OrganizationId);
public record ApplicationStatisticsResp
{
    public IReadOnlyDictionary<ApplicationPortalStatusCd, int> Statistics { get; set; } = new Dictionary<ApplicationPortalStatusCd, int>();
}

public enum ApplicationPortalStatusCd
{
    Draft,
    VerifyIdentity,
    InProgress,
    AwaitingPayment,
    AwaitingThirdParty,
    AwaitingApplicant,
    UnderAssessment,
    Incomplete,
    CompletedCleared,
    RiskFound,
    ClosedJudicialReview,
    ClosedNoResponse,
    ClosedNoConsent,
    CancelledByApplicant,
    CancelledByOrganization
}


