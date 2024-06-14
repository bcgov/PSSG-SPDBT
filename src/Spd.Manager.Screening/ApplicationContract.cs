using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Delegates;
using System.ComponentModel;
using GenderCode = Spd.Manager.Shared.GenderCode;

namespace Spd.Manager.Screening
{
    public interface IApplicationManager
    {
        public Task<ApplicationInvitesCreateResponse> Handle(ApplicationInviteCreateCommand request, CancellationToken ct);
        public Task<AppOrgResponse> Handle(ApplicationInviteVerifyCommand request, CancellationToken ct);
        public Task<ApplicationInviteListResponse> Handle(ApplicationInviteListQuery request, CancellationToken ct);
        public Task<Unit> Handle(ApplicationInviteDeleteCommand request, CancellationToken ct);
        public Task<ApplicationListResponse> Handle(ApplicationListQuery request, CancellationToken ct);
        public Task<ApplicationPaymentListResponse> Handle(ApplicationPaymentListQuery request, CancellationToken ct);
        public Task<ApplicationCreateResponse> Handle(ApplicationCreateCommand request, CancellationToken ct);
        public Task<ApplicationCreateResponse> Handle(ApplicantApplicationCreateCommand request, CancellationToken ct);
        public Task<ApplicationStatisticsResponse> Handle(ApplicationStatisticsQuery request, CancellationToken ct);
        public Task<Unit> Handle(VerifyIdentityCommand request, CancellationToken ct);
        public Task<BulkHistoryListResponse> Handle(GetBulkUploadHistoryQuery request, CancellationToken ct);
        public Task<BulkUploadCreateResponse> Handle(BulkUploadCreateCommand cmd, CancellationToken ct);
        public Task<ClearanceAccessListResponse> Handle(ClearanceAccessListQuery request, CancellationToken ct);
        public Task<Unit> Handle(ClearanceAccessDeleteCommand request, CancellationToken ct);
        public Task<ApplicationInvitePrepopulateDataResponse> Handle(GetApplicationInvitePrepopulateDataQuery request, CancellationToken ct);
        public Task<FileResponse> Handle(ClearanceLetterQuery query, CancellationToken ct);
        public Task<ApplicantApplicationListResponse> Handle(ApplicantApplicationListQuery request, CancellationToken ct);
        public Task<ShareableClearanceResponse> Handle(ShareableClearanceQuery request, CancellationToken ct);
        public Task<ApplicantApplicationFileListResponse> Handle(ApplicantApplicationFileQuery query, CancellationToken ct);
        public Task<IEnumerable<ApplicantAppFileCreateResponse>> Handle(CreateApplicantAppFileCommand query, CancellationToken ct);
        public Task<FileResponse> Handle(PrepopulateFileTemplateQuery query, CancellationToken ct);
        public Task<DelegateResponse> Handle(CreateDelegateCommand cmd, CancellationToken ct);
        public Task<DelegateListResponse> Handle(DelegateListQuery query, CancellationToken ct);
        public Task<Unit> Handle(DeleteDelegateCommand cmd, CancellationToken ct);
    }

    #region application invites
    public record ApplicationInviteCreateCommand(ApplicationInvitesCreateRequest ApplicationInvitesCreateRequest, Guid OrgId, Guid UserId, bool IsPSA = false) : IRequest<ApplicationInvitesCreateResponse>;
    public record ApplicationInviteListQuery() : IRequest<ApplicationInviteListResponse>
    {
        public AppInviteListFilterBy? FilterBy { get; set; }
        public AppInviteListSortBy? SortBy { get; set; }
        public PaginationRequest Paging { get; set; } = null!;
        public bool IsPSSO { get; set; } = false;
        public bool IsPSA { get; set; } = false;
        public Guid? UserId { get; set; } = null;
    };
    public record ApplicationInviteDeleteCommand(Guid OrgId, Guid ApplicationInviteId) : IRequest<Unit>;
    public record ApplicationInviteVerifyCommand(AppInviteVerifyRequest AppInvitesVerifyRequest) : IRequest<AppOrgResponse>;
    public record AppInviteListFilterBy(Guid OrgId, string? EmailOrNameContains);
    public record AppInviteListSortBy(bool? SubmittedDateDesc);
    public record AppInviteVerifyRequest(string InviteEncryptedCode);
    public record AppOrgResponse
    {
        public Guid? AppInviteId { get; set; }
        public Guid OrgId { get; set; }
        public string? OrgName { get; set; }
        public string? OrgPhoneNumber { get; set; }
        public string? OrgEmail { get; set; }
        public string? OrgAddressLine1 { get; set; }
        public string? OrgAddressLine2 { get; set; }
        public string? OrgCity { get; set; }
        public string? OrgCountry { get; set; }
        public string? OrgPostalCode { get; set; }
        public string? OrgProvince { get; set; }
        public BooleanTypeCode ContractorsNeedVulnerableSectorScreening { get; set; }
        public BooleanTypeCode? LicenseesNeedVulnerableSectorScreening { get; set; }
        public EmployeeInteractionTypeCode? WorksWith { get; set; }
        public EmployeeOrganizationTypeCode? EmployeeOrganizationTypeCode { get; set; }
        public VolunteerOrganizationTypeCode? VolunteerOrganizationTypeCode { get; set; }
        public string? GivenName { get; set; }
        public string? Surname { get; set; }
        public string? EmailAddress { get; set; }
        public string? JobTitle { get; set; }
        public PayerPreferenceTypeCode? PayeeType { get; set; }
        public ScreeningTypeCode? ScreeningType { get; set; }
        public ServiceTypeCode? ServiceType { get; set; }
    };

    public record VerifyIdentityCommand(Guid OrgId, Guid ApplicationId, IdentityStatusCode Status) : IRequest<Unit>;
    public record ApplicationInvitesCreateRequest
    {
        public string? HostUrl { get; set; }
        public bool RequireDuplicateCheck { get; set; }
        public IEnumerable<ApplicationInviteCreateRequest> ApplicationInviteCreateRequests { get; set; } = Array.Empty<ApplicationInviteCreateRequest>();
    }
    public abstract record ApplicationInvite
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? JobTitle { get; set; }
        public PayerPreferenceTypeCode? PayeeType { get; set; }
        public Guid OrgId { get; set; }
    }
    public record ApplicationInviteCreateRequest : ApplicationInvite
    {
        public ServiceTypeCode ServiceType { get; set; } = ServiceTypeCode.CRRP_EMPLOYEE;
        public ScreeningTypeCode ScreeningType { get; set; } = ScreeningTypeCode.Staff;
        public Guid? OriginalClearanceAccessId { get; set; } = null;
    }
    public record ApplicationInvitesCreateResponse(Guid OrgId)
    {
        public bool IsDuplicateCheckRequired { get; set; }
        public bool CreateSuccess { get; set; }
        public string? ErrorReason { get; set; }
        public IEnumerable<ApplicationInviteDuplicateResponse> DuplicateResponses { get; set; } = Array.Empty<ApplicationInviteDuplicateResponse>();
    }
    public record ApplicationInviteDuplicateResponse : ApplicationInvite
    {
        public bool HasPotentialDuplicate { get; set; } = false;
    }
    public record ApplicationInviteListResponse
    {
        public IEnumerable<ApplicationInviteResponse> ApplicationInvites { get; set; } = Array.Empty<ApplicationInviteResponse>();
        public PaginationResponse Pagination { get; set; } = null!;
    }
    public record ApplicationInviteResponse : ApplicationInvite
    {
        public Guid Id { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public ApplicationInviteStatusCode Status { get; set; }
        public string? ErrorMsg { get; set; }
        public bool? Viewed { get; set; }
    }
    public enum ApplicationInviteStatusCode
    {
        Draft,
        Sent,
        Failed,
        Completed, //inactive Status code
        Cancelled,//inactive Status code
        Expired //inactive Status code
    }
    #endregion

    #region application
    public record ApplicationCreateCommand(ApplicationCreateRequest ApplicationCreateRequest, Guid? ParentOrgId, Guid UserId, IFormFile? ConsentFormFile) : IRequest<ApplicationCreateResponse>;
    public record ApplicationListQuery : IRequest<ApplicationListResponse>
    {
        public AppListFilterBy? FilterBy { get; set; } //null means no filter
        public AppListSortBy? SortBy { get; set; } //null means no sorting
        public PaginationRequest Paging { get; set; } = null!;
        public bool IsPSSO { get; set; } = false;
        public bool ShowAllPSSOApps { get; set; } = false;
        public Guid? UserId { get; set; } = null;
    };

    public record ApplicationStatisticsQuery(Guid? OrganizationId = null, Guid? DelegateUserId = null, bool ShowAllPSSOApps = false) : IRequest<ApplicationStatisticsResponse>;
    public record AppListFilterBy(Guid? OrgId)
    {
        public IEnumerable<ApplicationPortalStatusCode>? ApplicationPortalStatus { get; set; }
        public string? NameOrEmailOrAppIdContains { get; set; }
        public Guid? ParentOrgId { get; set; }

    }
    public record AppListSortBy(bool? SubmittedDateDesc = true, bool? NameDesc = null, bool? CompanyNameDesc = null);

    public record ApplicationPaymentListQuery : IRequest<ApplicationPaymentListResponse>
    {
        public AppPaymentListFilterBy? FilterBy { get; set; } //null means no filter
        public AppPaymentListSortBy? SortBy { get; set; } //null means no sorting
        public PaginationRequest Paging { get; set; } = null!;
    };

    public record AppPaymentListFilterBy(Guid OrgId)
    {
        public IEnumerable<ApplicationPortalStatusCode>? ApplicationPortalStatus { get; set; }
        public bool? Paid { get; set; } = null;
        public DateTimeOffset? FromDateTime { get; set; } = null;
        public DateTimeOffset? ToDateTime { get; set; } = null;
        public PayerPreferenceTypeCode? PayerType { get; set; } = PayerPreferenceTypeCode.Organization;
        public string? NameOrAppIdContains { get; set; }
    }

    public record AppPaymentListSortBy(bool? PaidAndSubmittedOnDesc = false);

    public abstract record Application
    {
        public Guid OrgId { get; set; }
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }
        public string? EmailAddress { get; set; }
        public string? JobTitle { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? ContractedCompanyName { get; set; }
        public PayerPreferenceTypeCode? PayeeType { get; set; }
    }
    public record ApplicationCreateRequest : Application
    {
        public ApplicationOriginTypeCode OriginTypeCode { get; set; }
        public string? PhoneNumber { get; set; }
        public string? DriversLicense { get; set; }
        public string? BirthPlace { get; set; }
        public GenderCode? GenderCode { get; set; }
        public ScreeningTypeCode? ScreeningType { get; set; }
        public ServiceTypeCode ServiceType { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? Province { get; set; }
        public string? Country { get; set; }
        public bool? OneLegalName { get; set; }
        public bool? AgreeToCompleteAndAccurate { get; set; }
        public bool? HaveVerifiedIdentity { get; set; }
        public IEnumerable<AliasCreateRequest> Aliases { get; set; } = Array.Empty<AliasCreateRequest>();
        public bool RequireDuplicateCheck { get; set; } = false;
        public string? EmployeeId { get; set; } //for psso
    }
    public record AliasCreateRequest
    {
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }
    }
    public class ApplicationCreateResponse
    {
        public bool IsDuplicateCheckRequired { get; set; } = false;
        public bool CreateSuccess { get; set; } = false;
        public Guid? ApplicationId { get; set; } = null;
        public bool HasPotentialDuplicate { get; set; } = false;
    }
    public class ApplicationListResponse
    {
        public IEnumerable<ApplicationResponse> Applications { get; set; } = Array.Empty<ApplicationResponse>();
        public PaginationResponse Pagination { get; set; } = null!;
    }
    public class ApplicationPaymentListResponse
    {
        public IEnumerable<ApplicationPaymentResponse> Applications { get; set; } = Array.Empty<ApplicationPaymentResponse>();
        public PaginationResponse Pagination { get; set; } = null!;
    }

    public record ApplicationStatisticsResponse
    {
        public IReadOnlyDictionary<ApplicationPortalStatisticsCode, int> Statistics { get; set; } = new Dictionary<ApplicationPortalStatisticsCode, int>();
    }

    public record ApplicationResponse : Application
    {
        public Guid Id { get; set; }
        public string? ApplicationNumber { get; set; }
        public bool? HaveVerifiedIdentity { get; set; }
        public DateTimeOffset? CreatedOn { get; set; }
        public ApplicationPortalStatusCode? Status { get; set; }
    }

    public record ApplicationPaymentResponse : ApplicationResponse
    {
        public DateTimeOffset? PaidOn { get; set; }
        public int? NumberOfAttempts { get; set; }
    }

    public record ClearanceAccessDeleteCommand(Guid ClearanceAccessId, Guid OrgId) : IRequest<Unit>;

    public enum ApplicationPortalStatusCode
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
        RefundRequested
    }

    public enum ApplicationPortalStatisticsCode
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

    public enum ApplicationOriginTypeCode
    {
        //applicant authenticated with bcsc submit app
        [Description("Portal")]
        Portal,

        [Description("Email")]
        Email,

        //applicant anonymous submit app
        [Description("Web Form")]
        WebForm,

        [Description("Mail")]
        Mail,

        [Description("Fax")]
        Fax,

        [Description("Generic Upload")]
        GenericUpload,

        //organization submit app manually
        [Description("Organization Submitted")]
        OrganizationSubmitted
    }
    public enum ApplicationStatusCode
    {
        Draft,
        PaymentPending,
        Incomplete,
        ApplicantVerification,
        Submitted,
        Cancelled,
    }


    public enum ScreeningTypeCode
    {
        [Description("Staff")]
        Staff,
        Contractor,
        Licensee
    }

    public enum IdentityStatusCode
    {
        Verified,
        Rejected
    }
    #endregion

    #region bulk upload
    public record GetBulkUploadHistoryQuery(Guid OrgId) : IRequest<BulkHistoryListResponse>
    {
        public string? SortBy { get; set; } //null means no sorting
        public PaginationRequest Paging { get; set; } = null!;
    };
    public record BulkHistoryListResponse
    {
        public IEnumerable<BulkHistoryResponse> BulkUploadHistorys { get; set; } = Array.Empty<BulkHistoryResponse>();
        public PaginationResponse Pagination { get; set; } = null!;
    }
    public record BulkHistoryResponse
    {
        public Guid Id { get; set; }
        public string BatchNumber { get; set; } = null!;
        public string FileName { get; set; } = null!;
        public string UploadedByUserFullName { get; set; } = null!;
        public DateTimeOffset UploadedDateTime { get; set; }
    }
    public record BulkUploadCreateCommand(BulkUploadCreateRequest BulkUploadCreateRequest, Guid OrgId, Guid UserId) : IRequest<BulkUploadCreateResponse>;
    public record BulkUploadCreateRequest(string FileName, long FileSize, IEnumerable<ApplicationCreateRequestFromBulk> ApplicationCreateRequests, bool RequireDuplicateCheck);
    public record ApplicationCreateRequestFromBulk : ApplicationCreateRequest
    {
        public int LineNumber { get; set; }
        public string? LicenceNo { get; set; } //upload id
    }
    public record BulkUploadRequest(IFormFile File, bool RequireDuplicateCheck = false);

    public record BulkUploadCreateResponse()
    {
        public IEnumerable<ValidationErr> ValidationErrs { get; set; } = Array.Empty<ValidationErr>();
        public IEnumerable<DuplicateCheckResult> DuplicateCheckResponses { get; set; } = Array.Empty<DuplicateCheckResult>();
        public BulkAppsCreateResponse CreateResponse { get; set; }
    }
    public record ValidationErr(int LineNumber, string Error);
    public record DuplicateCheckResult()
    {
        public bool HasPotentialDuplicate { get; set; } = false;
        public string? FirstName { get; set; }
        public string LastName { get; set; } = null!;
        public int LineNumber { get; set; }
        public string? Msg { get; set; } = null;
        public bool HasPotentialDuplicateInTsv { get; set; } = false;
        public bool HasPotentialDuplicateInDb { get; set; } = false;
    }
    public record BulkAppsCreateResponse
    {
        public IEnumerable<ApplicationCreateResult> CreateAppResults { get; set; } = Array.Empty<ApplicationCreateResult>();
        public BulkAppsCreateResultCode BulkAppsCreateCode { get; set; } = BulkAppsCreateResultCode.Success;
    }
    public enum BulkAppsCreateResultCode
    {
        Success,
        PartiallySuccess,
        Failed,
    }
    public record ApplicationCreateResult()
    {
        public int LineNumber { get; set; }
        public Guid ApplicationId { get; set; }
        public bool CreateSuccess { get; set; } = false;
    };
    #endregion

    #region clearances
    public record ClearanceAccessListQuery : IRequest<ClearanceAccessListResponse>
    {
        public ClearanceAccessListFilterBy? FilterBy { get; set; } //null means no filter
        public ClearanceAccessListSortBy? SortBy { get; set; } //null means no sorting
        public PaginationRequest Paging { get; set; } = null!;
    }
    public record ClearanceAccessListFilterBy(Guid OrgId)
    {
        public string? NameOrEmailContains { get; set; }
    }
    public record ClearanceAccessListSortBy(bool? ExpiresOn = true, bool? NameDesc = null, bool? CompanyNameDesc = null);
    public record ClearanceAccessListResponse
    {
        public IEnumerable<ClearanceAccessResponse> Clearances { get; set; } = Array.Empty<ClearanceAccessResponse>();
        public PaginationResponse Pagination { get; set; } = null!;
    }
    public record ClearanceAccessResponse
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTimeOffset? ExpiresOn { get; set; } = null!;
        public string Facility { get; set; } = null!;
        public string Status { get; set; } = null!;
        public Guid ClearanceId { get; set; }
    }

    public record ClearanceLetterQuery(Guid ClearanceId) : IRequest<FileResponse>;

    public record ShareableClearanceQuery(Guid OrgId, string BcscId, ServiceTypeCode ServiceType) : IRequest<ShareableClearanceResponse>;

    public record ShareableClearanceResponse()
    {
        public IEnumerable<ShareableClearanceItem> Items { get; set; } = Array.Empty<ShareableClearanceItem>();
    }
    public record ShareableClearanceItem()
    {
        public Guid OrgId { get; set; }
        public ServiceTypeCode ServiceType { get; set; }
        public DateTimeOffset? GrantedDate { get; set; }
        public DateTimeOffset? ExpiryDate { get; set; }
        public Guid ClearanceId { get; set; }
    }

    public record ApplicationInvitePrepopulateDataResponse : ApplicationInvite
    {
        public ServiceTypeCode ServiceType { get; set; } = ServiceTypeCode.CRRP_EMPLOYEE;
        public ScreeningTypeCode ScreeningType { get; set; } = ScreeningTypeCode.Staff;
    };

    public record GetApplicationInvitePrepopulateDataQuery(Guid ClearanceId) : IRequest<ApplicationInvitePrepopulateDataResponse>;
    #endregion

    #region validator
    public class ApplicationInviteCreateRequestValidator : AbstractValidator<ApplicationInviteCreateRequest>
    {
        public ApplicationInviteCreateRequestValidator()
        {
            RuleFor(r => r.FirstName)
                    .NotEmpty()
                    .MaximumLength(40);

            RuleFor(r => r.LastName)
                    .NotEmpty()
                    .MaximumLength(40);

            RuleFor(r => r.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(75);

            RuleFor(r => r.JobTitle)
                    .NotEmpty()
                    .MaximumLength(100);
        }
    }

    public class AliasCreateRequestValidator : AbstractValidator<AliasCreateRequest>
    {
        public AliasCreateRequestValidator()
        {
            RuleFor(r => r.GivenName)
                    .MaximumLength(40);

            RuleFor(r => r.MiddleName1)
                    .MaximumLength(40);

            RuleFor(r => r.MiddleName2)
                    .MaximumLength(40);

            RuleFor(r => r.Surname)
                    .NotEmpty()
                    .MaximumLength(40);
        }
    }

    public class ApplicationCreateRequestFromBulkValidator : AbstractValidator<ApplicationCreateRequestFromBulk>
    {
        public ApplicationCreateRequestFromBulkValidator()
        {
            RuleFor(r => r.OriginTypeCode)
                .IsInEnum();

            RuleFor(r => r.GivenName)
             .MaximumLength(40)
             .NotEmpty();

            RuleFor(r => r.MiddleName1)
                    .MaximumLength(40);

            RuleFor(r => r.MiddleName2)
                    .MaximumLength(40);

            RuleFor(r => r.Surname)
                    .NotEmpty()
                    .MaximumLength(40);

            RuleFor(r => r.EmailAddress)
                .EmailAddress()
                .MaximumLength(75);

            RuleFor(r => r.PhoneNumber)
                 .MaximumLength(30)
                 .NotEmpty();

            RuleFor(r => r.DateOfBirth)
                .NotEmpty()
                .Must(birth => (((DateOnly)birth).Year + 13) < DateTimeOffset.UtcNow.Year)
                .NotNull();

            RuleFor(r => r.BirthPlace)
                    .NotEmpty();

            RuleFor(r => r.AddressLine1)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.AddressLine2)
                    .MaximumLength(100);

            RuleFor(r => r.City)
                    .NotEmpty()
                    .MaximumLength(100);

            //spdbt-2653: make postal code optional, so RuleFor postalcode is removed.

            RuleFor(r => r.Province)
                    .MaximumLength(100);

            RuleFor(r => r.Country)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.AgreeToCompleteAndAccurate)
                .NotEmpty()
                .Equal(true);

            RuleFor(r => r.HaveVerifiedIdentity)
                .Equal(true); // Must be true or false

            //change from 15 to 25 for max len, spdbt-2653
            RuleFor(r => r.DriversLicense)
                .MaximumLength(25);

            RuleFor(r => r.LicenceNo)
                .MaximumLength(25);
        }
    }

    public class ApplicationCreateRequestValidator : AbstractValidator<ApplicationCreateRequest>
    {
        public ApplicationCreateRequestValidator()
        {
            RuleFor(r => r.OriginTypeCode)
                .IsInEnum();

            RuleFor(r => r.GivenName)
                    .MaximumLength(40);

            RuleFor(r => r.GivenName)
                    .NotEmpty()
                    .When(r => r.OneLegalName != true);

            RuleFor(r => r.MiddleName1)
                    .MaximumLength(40);

            RuleFor(r => r.MiddleName2)
                    .MaximumLength(40);

            RuleFor(r => r.Surname)
                    .NotEmpty()
                    .MaximumLength(40);

            RuleFor(r => r.EmailAddress)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(75)
                .When(r => r.ServiceType != ServiceTypeCode.PSSO &&
                    r.ServiceType != ServiceTypeCode.PSSO_VS &&
                    r.ServiceType != ServiceTypeCode.MCFD &&
                    r.ServiceType != ServiceTypeCode.PE_CRC &&
                    r.ServiceType != ServiceTypeCode.PE_CRC_VS);

            RuleFor(r => r.EmailAddress)
                .EmailAddress()
                .MaximumLength(75)
                .When(r => !string.IsNullOrWhiteSpace(r.EmailAddress));

            RuleFor(r => r.PhoneNumber)
                    .NotEmpty();

            RuleFor(r => r.DateOfBirth)
                    .NotEmpty();

            RuleFor(r => r.BirthPlace)
                    .NotEmpty();

            RuleFor(r => r.JobTitle)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.ScreeningType)
                    .IsInEnum();

            RuleFor(r => r.ContractedCompanyName)
                    .NotEmpty()
                    .When(r => r.ScreeningType == ScreeningTypeCode.Contractor || r.ScreeningType == ScreeningTypeCode.Licensee);

            RuleFor(r => r.ServiceType)
                .IsInEnum();

            RuleFor(r => r.AddressLine1)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.AddressLine2)
                    .MaximumLength(100);

            RuleFor(r => r.City)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.PostalCode)
                    .NotEmpty()
                    .MaximumLength(20);

            RuleFor(r => r.Province)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.Country)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.AgreeToCompleteAndAccurate)
                .NotEmpty()
                .Equal(true);

            RuleFor(r => r.HaveVerifiedIdentity)
                .NotNull(); // Must be true or false

            RuleFor(r => r.EmployeeId) //Employee ID validation: Whole Number, 6 digits - spdbt-2401
                .Length(6)
                .Must(r => int.TryParse(r, out var i) && i > 0)
                .When(r => !string.IsNullOrEmpty(r.EmployeeId) &&
                    (r.ServiceType == ServiceTypeCode.PSSO ||
                    r.ServiceType == ServiceTypeCode.PSSO_VS ||
                    r.ServiceType != ServiceTypeCode.MCFD ||
                    r.ServiceType != ServiceTypeCode.PE_CRC ||
                    r.ServiceType != ServiceTypeCode.PE_CRC_VS));
        }
    }

    public class ApplicantAppCreateRequestValidator : AbstractValidator<ApplicantAppCreateRequest>
    {
        public ApplicantAppCreateRequestValidator()
        {
            Include(new ApplicationCreateRequestValidator());
            RuleFor(a => a.AgreeToCriminalCheck)
                .NotEmpty()
                .Equal(true)
                .When(a => a.AgreeToShareCrc != null && !(bool)a.AgreeToShareCrc);
            RuleFor(a => a.AgreeToVulnerableSectorSearch)
                .NotEmpty()
                .Equal(true)
                .When(a => a.AgreeToShareCrc != null && !(bool)a.AgreeToShareCrc);
            RuleFor(a => a.ConsentToCompletedCrc)
                .Equal(true)
                .When(a => a.AgreeToShareCrc != null && (bool)a.AgreeToShareCrc);
            RuleFor(a => a.ConsentToNotifyNoCrc)
                .Equal(true)
                .When(a => a.AgreeToShareCrc != null && (bool)a.AgreeToShareCrc);
            RuleFor(a => a.ConsentToNotifyRisk)
                .Equal(true)
                .When(a => a.AgreeToShareCrc != null && (bool)a.AgreeToShareCrc);
            RuleFor(a => a.ConsentToShareResultCrc)
                .Equal(true)
                .When(a => a.AgreeToShareCrc != null && (bool)a.AgreeToShareCrc);
        }
    }
    #endregion

    #region applicant-applications
    public record ApplicantApplicationCreateCommand(ApplicantAppCreateRequest ApplicationCreateRequest, string? BcscId = null) : IRequest<ApplicationCreateResponse>;

    public record ApplicantAppCreateRequest : ApplicationCreateRequest
    {
        public Guid? AppInviteId { get; set; }
        public bool? AgreeToVulnerableSectorSearch { get; set; }
        public bool? AgreeToCriminalCheck { get; set; }
        public bool? AgreeToShareCrc { get; set; } = false;
        public Guid? SharedClearanceId { get; set; } = null;
        public bool? ConsentToShareResultCrc { get; set; } = null;
        public bool? ConsentToCompletedCrc { get; set; } = null;
        public bool? ConsentToNotifyNoCrc { get; set; } = null;
        public bool? ConsentToNotifyRisk { get; set; } = null;
    }

    public record ApplicantApplicationResponse : ApplicationResponse
    {
        public string? OrgName { get; set; }
        public ServiceTypeCode? ServiceType { get; set; }
        public CaseSubStatusCode? CaseSubStatus { get; set; }
        public int FailedPaymentAttempts { get; set; } = 0;
    }

    public record ApplicantApplicationListQuery(Guid ApplicantId) : IRequest<ApplicantApplicationListResponse>;

    public record ApplicantApplicationQuery(Guid ApplicantId, Guid ApplicationId) : IRequest<ApplicantApplicationResponse>;

    public class ApplicantApplicationListResponse
    {
        public IEnumerable<ApplicantApplicationResponse> Applications { get; set; } = Array.Empty<ApplicantApplicationResponse>();
    }

    public enum CaseSubStatusCode
    {
        ApplicantInformation,
        Fingerprints,
        SelfDisclosure,
        OpportunityToRespond
    }
    #endregion

    #region applicant-application-file

    public record ApplicantApplicationFileQuery(Guid ApplicationId, string BcscId) : IRequest<ApplicantApplicationFileListResponse>;
    public record ApplicantApplicationFileListResponse
    {
        public IEnumerable<ApplicantApplicationFileResponse> Items { get; set; } = Array.Empty<ApplicantApplicationFileResponse>();
    }

    public record ApplicantApplicationFileResponse
    {
        public string? FileName { get; set; } = null!;
        public FileTypeCode? FileTypeCode { get; set; } = null;
        public DateTimeOffset UploadedDateTime { get; set; }
    }

    public record CreateApplicantAppFileCommand(ApplicantAppFileUploadRequest Request, string BcscId, Guid ApplicationId) : IRequest<IEnumerable<ApplicantAppFileCreateResponse>>;
    public record ApplicantAppFileUploadRequest(
        IList<IFormFile> Files,
        FileTypeCode FileType = FileTypeCode.SelfDisclosure
    );
    public record ApplicantAppFileCreateResponse
    {
        public Guid DocumentUrlId { get; set; }
        public DateTimeOffset UploadedDateTime { get; set; }
        public Guid? ApplicationId { get; set; } = null;
    };

    public record PrepopulateFileTemplateQuery(FileTemplateTypeCode FileTemplateType, Guid ApplicationId) : IRequest<FileResponse>;

    public enum FileTypeCode
    {
        ApplicantConsentForm,
        ApplicantInformation,
        ArmouredCarGuard,
        ArmouredVehiclePurpose,
        ArmouredVehicleRationale,
        BCCompaniesRegistrationVerification,
        BCServicesCard,
        BirthCertificate,
        BodyArmourPurpose,
        BodyArmourRationale,
        BusinessInsurance,
        CanadianCitizenship,
        CanadianFirearmsLicense,
        CanadianNativeStatusCard,
        CertificateOfAdvancedSecurityTraining,
        ClearanceLetter,
        ConfirmationLetterFromSuperiorOfficer,
        ConfirmationOfFingerprints,
        ConvictedOffence,
        CriminalCharges,
        DriverLicense,
        GovtIssuedPhotoID,
        LegalNameChange,
        LegalWorkStatus,
        LetterOfNoConflict, //PoliceBackgroundLetterOfNoConflict
        Locksmith,
        ManualPaymentForm,
        MentalHealthConditionForm, //MentalHealthCondition
        Passport,
        PaymentReceipt,
        PermanentResidenceCard,
        Photograph, //PhotoOfYourself
        PrivateInvestigator,
        PrivateInvestigatorUnderSupervision,
        SecurityAlarmInstaller,
        SecurityConsultant,
        SecurityGuard,
        SelfDisclosure,
        ValidationCertificate,
        OpportunityToRespond
    }

    public enum FileTemplateTypeCode
    {
        FingerprintsPkg,
        SelfDisclosurePkg
    }
    #endregion


    #region application-delegates

    public class DelegateListResponse
    {
        public IEnumerable<DelegateResponse> Delegates { get; set; } = Array.Empty<DelegateResponse>();
    }

    public record DelegateResponse
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string EmailAddress { get; set; } = null!;
        public PSSOUserRoleEnum PSSOUserRoleCode { get; set; }
        public Guid? PortalUserId { get; set; }
    }

    public record DelegateCreateRequest
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string EmailAddress { get; set; } = null!;
    }

    public record DelegateListQuery(Guid OrgId, Guid ApplicationId) : IRequest<DelegateListResponse>;
    public record CreateDelegateCommand(Guid OrgId, Guid ApplicationId, DelegateCreateRequest CreateRequest) : IRequest<DelegateResponse>;
    public record DeleteDelegateCommand(Guid Id, Guid CurrentUserId, Guid ApplicationId, bool CurrentUserIsPSA = false) : IRequest<Unit>;

    public class DelegateCreateRequestValidator : AbstractValidator<DelegateCreateRequest>
    {
        public DelegateCreateRequestValidator()
        {
            RuleFor(r => r.FirstName)
                 .NotEmpty()
                    .MaximumLength(40);

            RuleFor(r => r.EmailAddress)
                .NotEmpty()
                .Must(e => e.EndsWith("gov.bc.ca"))
                .EmailAddress()
                .MaximumLength(75);
        }
    }
    #endregion
}
