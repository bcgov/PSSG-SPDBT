namespace Spd.Resource.Applicants;

public interface IApplicationRepository
{
    public Task AddApplicationInvitesAsync(ApplicationInviteCreateCmd createInviteCmd, CancellationToken cancellationToken);

    Task<bool> CheckInviteInvitationDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken);

    Task<bool> CheckInviteApplicationDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken);

    public Task<Guid?> AddApplicationAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken cancellationToken);

    Task<bool> CheckApplicationDuplicateAsync(SearchApplicationQry searchApplicationQry, CancellationToken cancellationToken);

    Task<ApplicationListResp> QueryAsync(ApplicationQuery query, CancellationToken cancellationToken);

    Task<ApplicationStatisticsQueryResponse> QueryAsync(ApplicationStatisticsQuery query, CancellationToken cancellationToken);
}

public record ApplicationQuery
{
    public FilterBy FilterBy { get; set; } //null means no filter
    public SortBy? SortBy { get; set; } //null means no sorting
    public Paging Paging { get; set; }
}
public record FilterBy(Guid OrgId, String? ApplicationStatus);
public record SortBy(bool? SubmittedDateDesc, bool? FirstNameDesc);
public record Paging(int Page, int PageSize);

public record ApplicationInviteCreateCmd
{
    public Guid OrgId { get; set; }
    public Guid CreatedByUserId { get; set; }
    public bool CheckDuplicate { get; set; }
    public IEnumerable<ApplicationInviteCreateReq> ApplicationInviteCreateReqs { get; set; }
}

public record ApplicationInviteCreateReq
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? JobTitle { get; set; }
    public PayerPreferenceTypeCode PayeeType { get; set; }
}

public record ApplicationInviteCreateResp
{
    public bool IsSuccess { get; set; }
    public bool ErrorReason { get; set; }
}

public record SearchInvitationQry
{
    public Guid OrgId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public record SearchApplicationQry
{
    public Guid OrgId { get; set; }
    public string GivenName { get; set; }
    public string Surname { get; set; }
    public DateTimeOffset? DateOfBirth { get; set; }
}

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
    public string? PaidBy { get; set; }
    public string? ContractedCompanyName { get; set; }
    public bool? HaveVerifiedIdentity { get; set; }
    public DateTimeOffset? CreatedOn { get; set; }
    public bool? HasBeenDelivered { get; set; }
}

public record PaginationResp
{
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
    public int Length { get; set; }
}

public class ApplicationListResp
{
    public int? FollowUpBusinessDays { get; set; }
    public IEnumerable<ApplicationResp> Applications { get; set; }
    public PaginationResp Pagination { get; set; }
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

public enum PayerPreferenceTypeCode
{
    Organization,
    Applicant
}

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
