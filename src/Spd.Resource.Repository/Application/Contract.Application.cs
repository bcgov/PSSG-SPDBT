using Spd.Resource.Repository.ApplicationInvite;
using Spd.Resource.Repository.Incident;

namespace Spd.Resource.Repository.Application;

public partial interface IApplicationRepository
{
    public static readonly List<ServiceTypeCode> ScreeningServiceTypes = new() {
        ServiceTypeCode.PSSO,
        ServiceTypeCode.CRRP_EMPLOYEE,
        ServiceTypeCode.CRRP_VOLUNTEER,
        ServiceTypeCode.PSSO_VS,
        ServiceTypeCode.MCFD,
        ServiceTypeCode.PE_CRC_VS,
        ServiceTypeCode.PE_CRC
    };
    public Task<Guid?> AddApplicationAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken cancellationToken);
    public Task ProcessAppWithSharableClearanceAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken cancellationToken);
    public Task<bool> CheckApplicationDuplicateAsync(SearchApplicationQry searchApplicationQry, CancellationToken cancellationToken);
    public Task<ApplicationListResp> QueryAsync(ApplicationListQry query, CancellationToken cancellationToken);
    public Task<ApplicationStatisticsResp> QueryApplicationStatisticsAsync(ApplicationStatisticsQry query, CancellationToken cancellationToken);
    public Task UpdateAsync(UpdateCmd cmd, CancellationToken ct);
    public Task<BulkAppsCreateResp> AddBulkAppsAsync(BulkAppsCreateCmd createApplicationCmds, CancellationToken cancellationToken);
    public Task<BulkHistoryListResp> QueryBulkHistoryAsync(BulkHistoryListQry query, CancellationToken cancellationToken);
    public Task<ClearanceAccessListResp> QueryAsync(ClearanceAccessListQry clearanceListQry, CancellationToken ct);
    public Task<ClearanceListResp> QueryAsync(ClearanceQry ShareableClearanceQry, CancellationToken ct);
    public Task DeleteClearanceAccessAsync(ClearanceAccessDeleteCmd clearanceAccessDeleteCmd, CancellationToken cancellationToken);
    public Task<ApplicantApplicationListResp> QueryApplicantApplicationListAsync(ApplicantApplicationListQry query, CancellationToken cancellationToken);
    public Task<ApplicationResult> QueryApplicationAsync(ApplicationQry query, CancellationToken cancellationToken);
}

#region application
//application list
public record ApplicationListQry
{
    public AppFilterBy? FilterBy { get; set; } //null means no filter
    public AppSortBy? SortBy { get; set; } //null means no sorting
    public Paging Paging { get; set; } = null!;
}
public record AppFilterBy()
{
    public IEnumerable<ApplicationPortalStatusEnum>? ApplicationPortalStatus { get; set; }
    public string? NameOrEmailOrAppIdContains { get; set; }
    public string? NameOrAppIdContains { get; set; }
    public bool? Paid { get; set; }
    public DateTimeOffset? FromDateTime { get; set; }
    public DateTimeOffset? ToDateTime { get; set; }
    public PayerPreferenceTypeCode? PayerType { get; set; } = null;
    public Guid? ParentOrgId { get; set; }
    public Guid? OrgId { get; set; }
    public string? DelegatePortalUserId { get; set; }
}
public record AppSortBy(bool? SubmittedDateDesc = null, bool? NameDesc = null, bool? CompanyNameDesc = null, bool? PaidAndSubmittedOnDesc = null);
public record SearchApplicationQry
{
    public Guid OrgId { get; set; }
    public string GivenName { get; set; }
    public string Surname { get; set; }
    public DateOnly? DateOfBirth { get; set; }
}

//application create
public record ApplicationCreateCmd
{
    public Guid OrgId { get; set; }
    public Guid? ParentOrgId { get; set; }
    public ApplicationOriginTypeCode OriginTypeCode { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public string? EmailAddress { get; set; }
    public string? PhoneNumber { get; set; }
    public string? DriversLicense { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? BirthPlace { get; set; }
    public Gender? GenderCode { get; set; }
    public string? JobTitle { get; set; }
    public string? ContractedCompanyName { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? PostalCode { get; set; }
    public string? Province { get; set; }
    public string? Country { get; set; }
    public bool? AgreeToCompleteAndAccurate { get; set; }
    public bool? AgreeToConsent { get; set; }
    public bool? HaveVerifiedIdentity { get; set; }
    public IEnumerable<AliasCreateCmd> Aliases { get; set; } = Array.Empty<AliasCreateCmd>();
    public Guid CreatedByUserId { get; set; }
    public PayerPreferenceTypeCode PayeeType { get; set; }
    public ServiceTypeCode? ServiceType { get; set; }
    public ScreenTypeEnum ScreeningType { get; set; } = ScreenTypeEnum.Staff;
    public string? CreatedByApplicantBcscId { get; set; } = null;
    public Guid? SharedClearanceId { get; set; } = null;
    public Guid? ContactId { get; set; }
    public string? EmployeeId { get; set; } //for psso
    public string? UploadId { get; set; } //for generic upload in screening

}

public record AliasCreateCmd
{
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }

}
public record UpdateCmd
{
    public Guid OrgId { get; set; }
    public Guid ApplicationId { get; set; }
    public ApplicationStatusEnum? Status { get; set; }
    public bool? HaveVerifiedIdentity { get; set; }
}

public enum ApplicationStatusEnum
{
    Draft,
    PaymentPending,
    Incomplete,
    ApplicantVerification,
    Submitted,
    Cancelled
}
public record SpdTempFile
{
    public string? TempFileKey { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public long FileSize { get; set; } = 0;
    public string? TempFilePath { get; set; } = null!;//it is the file location in the hard disk
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
    public PayerPreferenceTypeCode? PayeeType { get; set; }
    public DateOnly? DateOfBirth { get; set; } = null;
    public string? ContractedCompanyName { get; set; }
    public ApplicationPortalStatusEnum? ApplicationPortalStatus { get; set; } = null!;
    public CaseStatusEnum? CaseStatus { get; set; }
    public CaseSubStatusEnum? CaseSubStatus { get; set; }
    public bool? HaveVerifiedIdentity { get; set; }
    public DateTimeOffset? CreatedOn { get; set; }
    public string? OrgName { get; set; }
    public ServiceTypeCode? ServiceType { get; set; }
    public ScreenTypeEnum? ScreeningType { get; set; }
    public DateTimeOffset? PaidOn { get; set; }
    public int? NumberOfAttempts { get; set; }
    public Guid? ApplicantId { get; set; }
}

public class ApplicationListResp
{
    public int? FollowUpBusinessDays { get; set; }
    public IEnumerable<ApplicationResult> Applications { get; set; } = Array.Empty<ApplicationResult>();
    public PaginationResp Pagination { get; set; } = null!;
}

public record ApplicantApplicationListQry
{
    public Guid ApplicantId { get; set; }
};

public record ApplicationQry(Guid ApplicationId);

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
public record ApplicationStatisticsQry(Guid? OrganizationId = null, Guid? DelegateUserId = null, bool ShowAllPSSOApps = false);
public record ApplicationStatisticsResp
{
    public IReadOnlyDictionary<ApplicationPortalStatisticsCd, int> Statistics { get; set; } = new Dictionary<ApplicationPortalStatisticsCd, int>();
}
#endregion

#region clearance
public record ClearanceAccessListQry
{
    public Guid OrgId { get; set; }
    public ClearanceAccessFilterBy? FilterBy { get; set; } //null means no filter
    public ClearanceAccessSortBy? SortBy { get; set; } //null means no sorting
    public Paging Paging { get; set; } = null!;
}
public record ClearanceAccessFilterBy(Guid OrgId)
{
    public string? NameOrEmailContains { get; set; }
    public ClearanceAccessStatusEnum ClearanceAccessStatus { get; set; } = ClearanceAccessStatusEnum.Approved;
}

public enum ClearanceAccessStatusEnum
{
    Draft,
    Approved, //active status
    Revoked
}
public record ClearanceAccessSortBy(bool? ExpiresOn = true, bool? NameDesc = null, bool? CompanyNameDesc = null);
public record ClearanceAccessListResp
{
    public IEnumerable<ClearanceAccessResp> Clearances { get; set; } = Array.Empty<ClearanceAccessResp>();
    public PaginationResp Pagination { get; set; } = null!;
}
public record ClearanceAccessResp
{
    public Guid Id { get; set; } //clearance access id
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateTimeOffset? ExpiresOn { get; set; } = null!;
    public string Facility { get; set; } = null!;
    public string Status { get; set; } = null!;
    public Guid ClearanceId { get; set; }
}
public record ClearanceAccessDeleteCmd
{
    public Guid ClearanceAccessId { get; set; }
    public Guid OrgId { get; set; }
}
public record ClearanceQry(Guid? ContactId = null,
    EmployeeInteractionTypeCode? WorkWith = null,
    DateTimeOffset? FromDate = null,
    ServiceTypeCode? ServiceType = null,
    bool? Shareable = null,
    Guid? ClearanceId = null,
    ServiceTypeCode? IncludeServiceTypeEnum = null,
    EmployeeInteractionTypeCode? IncludeWorkWith = null);
public record ClearanceResp
{
    public Guid OrgId { get; set; }
    public ServiceTypeCode ServiceType { get; set; }
    public DateTimeOffset? GrantedDate { get; set; }
    public DateTimeOffset? ExpiryDate { get; set; }
    public EmployeeInteractionTypeCode? WorkWith { get; set; }
    public Guid ClearanceId { get; set; }
    public Guid ApplicationId { get; set; }
}
public record ClearanceListResp
{
    public IEnumerable<ClearanceResp> Clearances { get; set; } = Array.Empty<ClearanceResp>();
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

#region applicant-applications

public record ApplicantApplicationListResp
{
    public IEnumerable<ApplicationResult> Applications { get; set; } = Array.Empty<ApplicationResult>();
}

#endregion

public enum ApplicationPortalStatusEnum
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
    ClosedNoResponse,
    ClosedNoConsent,
    CancelledByApplicant,
    CancelledByOrganization,
    Completed,
    RefundRequested
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
    ClosedNoResponse,
    ClosedNoConsent,
    CancelledByApplicant,
    CancelledByOrganization,
    ClearedLastSevenDays,
    NotClearedLastSevenDays
}
