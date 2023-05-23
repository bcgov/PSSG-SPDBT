namespace Spd.Resource.Applicants.Application;

public interface IApplicationRepository
{
    public Task<Guid?> AddApplicationAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken cancellationToken);
    public Task<bool> CheckApplicationDuplicateAsync(SearchApplicationQry searchApplicationQry, CancellationToken cancellationToken);
    public Task<ApplicationListResp> QueryAsync(ApplicationListQry query, CancellationToken cancellationToken);
    public Task<ApplicationStatisticsResp> QueryApplicationStatisticsAsync(ApplicationStatisticsQry query, CancellationToken cancellationToken);
    public Task IdentityAsync(IdentityCmd cmd, CancellationToken ct);
    public Task<BulkAppsCreateResp> AddBulkAppsAsync(BulkAppsCreateCmd createApplicationCmds, CancellationToken cancellationToken);
    public Task<BulkHistoryListResp> QueryBulkHistoryAsync(BulkHistoryListQry query, CancellationToken cancellationToken);
    public Task<ClearanceListResp> QueryAsync(ClearanceListQry clearanceListQry, CancellationToken ct);
    public Task DeleteClearanceAccessAsync(ClearanceAccessDeleteCmd clearanceAccessDeleteCmd, CancellationToken cancellationToken);
}

#region application
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
    public GenderCode? GenderCode { get; set; }
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
    public IEnumerable<AliasCreateCmd> Aliases { get; set; } = Array.Empty<AliasCreateCmd>();
    public Guid CreatedByUserId { get; set; }
    public PayerPreferenceTypeCode PayeeType { get; set; }
    public SpdTempFile ConsentFormTempFile { get; set; } = null!;
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
    public IdentityStatusCode Status { get; set; }
}
public record SpdTempFile
{
    public string TempFileKey { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public long FileSize { get; set; } = 0;
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
public enum GenderCode
{
    M,
    F,
    X
}
public enum IdentityStatusCode
{
    Verified,
    Rejected
}

public enum FileCategoryCode
{
    ConsentForm,
}

//application statistics
public record ApplicationStatisticsQry(Guid OrganizationId);
public record ApplicationStatisticsResp
{
    public IReadOnlyDictionary<ApplicationPortalStatisticsCd, int> Statistics { get; set; } = new Dictionary<ApplicationPortalStatisticsCd, int>();
}
#endregion

#region clearance
public record ClearanceListQry
{
    public Guid OrgId { get; set; }
    public ClearanceFilterBy? FilterBy { get; set; } //null means no filter
    public ClearanceSortBy? SortBy { get; set; } //null means no sorting
    public Paging Paging { get; set; } = null!;
}
public record ClearanceFilterBy(Guid OrgId)
{
    public string? NameOrEmailContains { get; set; }
}
public record ClearanceSortBy(bool? ExpiresOn = true, bool? NameDesc = null, bool? CompanyNameDesc = null);
public record ClearanceListResp
{
    public IEnumerable<ClearanceResp> Clearances { get; set; } = Array.Empty<ClearanceResp>();
    public PaginationResp Pagination { get; set; } = null!;
}
public record ClearanceResp
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateTimeOffset? ExpiresOn { get; set; } = null!;
    public string Facility { get; set; } = null!;
    public string Status { get; set; } = null!;
}
public record ClearanceAccessDeleteCmd
{
    public Guid ClearanceAccessId { get; set; }
    public Guid OrgId { get; set; }
}
#endregion

#region bulk upload
public record BulkHistoryListQry
{
    public Guid OrgId { get; set; }
    public BulkHistorySortBy? SortBy { get; set; } //null means no sorting
    public Paging Paging { get; set; } = null!;
}

public record BulkHistorySortBy(bool? SubmittedDateDesc = true);
public record BulkHistoryListResp
{
    public IEnumerable<BulkHistoryResp> BulkUploadHistorys { get; set; } = Array.Empty<BulkHistoryResp>();
    public PaginationResp Pagination { get; set; } = null!;
}
public record BulkHistoryResp
{
    public Guid Id { get; set; }
    public string BatchNumber { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public string UploadedByUserFullName { get; set; } = null!;
    public DateTimeOffset UploadedDateTime { get; set; }
}
public record BulkAppsCreateCmd
{
    public IEnumerable<ApplicationCreateCmd> CreateApps { get; set; } = Array.Empty<ApplicationCreateCmd>();
    public string FileName { get; set; } = null!;
    public long FileSize { get; set; }
    public Guid UserId { get; set; }
    public Guid OrgId { get; set; }
}
public record BulkAppsCreateResp
{
    public IEnumerable<ApplicationCreateRslt> CreateAppResults { get; set; } = Array.Empty<ApplicationCreateRslt>();
    public BulkAppsCreateResultCd BulkAppsCreateCode { get; set; } = BulkAppsCreateResultCd.Success;
}
public enum BulkAppsCreateResultCd
{
    Success,
    PartiallySuccess,
    Failed,
}
public record ApplicationCreateRslt()
{
    public int LineNumber { get; set; }
    public Guid ApplicationId { get; set; }
    public bool CreateSuccess { get; set; } = false;
};
#endregion
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
    CancelledByOrganization,
}

public enum ApplicationPortalStatisticsCd
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
    CancelledByOrganization,
    ClearedLastSevenDays,
    NotClearedLastSevenDays
}
