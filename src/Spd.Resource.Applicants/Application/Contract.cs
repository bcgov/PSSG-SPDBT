using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Application;

public interface IApplicationRepository
{
    public Task<Guid?> AddApplicationAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken cancellationToken);
    Task<bool> CheckApplicationDuplicateAsync(SearchApplicationQry searchApplicationQry, CancellationToken cancellationToken);
    Task<ApplicationListResp> QueryAsync(ApplicationQuery query, CancellationToken cancellationToken);
    Task<ApplicationStatisticsQueryResponse> QueryAsync(ApplicationStatisticsQuery query, CancellationToken cancellationToken);
}

//application list
public record ApplicationQuery
{
    public AppFilterBy FilterBy { get; set; } //null means no filter
    public AppSortBy? SortBy { get; set; } //null means no sorting
    public Paging Paging { get; set; }
}
public record AppFilterBy(Guid OrgId, string? ApplicationStatus);
public record AppSortBy(bool? SubmittedDateDesc, bool? FirstNameDesc);

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
}
public record AliasCreateCmd
{
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }

}
public record ApplicationResp
{
    public Guid Id { get; set; }
    public Guid OrgId { get; set; }
    public string? ApplicationNumber { get; set; }
    public string? CaseNumber { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public string? EmailAddress { get; set; }
    public string? JobTitle { get; set; }
    public PayerPreferenceTypeCode? PaidBy { get; set; }
    public string? ContractedCompanyName { get; set; }
    public bool? HaveVerifiedIdentity { get; set; }
    public DateTimeOffset? CreatedOn { get; set; }
    public ApplicationActiveStatus? Status { get; set; }
}
public class ApplicationListResp
{
    public int? FollowUpBusinessDays { get; set; }
    public IEnumerable<ApplicationResp> Applications { get; set; } = Array.Empty<ApplicationResp>();
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
public record ApplicationStatisticsQuery(Guid OrganizationId);
public record ApplicationStatisticsQueryResponse
{
    public IReadOnlyDictionary<ApplicationsStatisticsCode, int> Statistics { get; set; } = new Dictionary<ApplicationsStatisticsCode, int>();
}
public enum ApplicationsStatisticsCode
{
    AwaitingApplicant,
    AwaitingPayment,
    AwaitingThirdParty,
    CancelledByApplicant,
    ClosedJudicialReview,
    ClosedNoConsent,
    ClosedNoResponse,
    Incomplete,
    InProgress,
    RiskFound,
    UnderAssessment,
    VerifyIdentity
}