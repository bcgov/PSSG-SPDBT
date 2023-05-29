using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.ComponentModel;

namespace Spd.Manager.Cases
{
    public interface IApplicationManager
    {
        public Task<ApplicationInvitesCreateResponse> Handle(ApplicationInviteCreateCommand request, CancellationToken ct);
        public Task<AppInviteVerifyResponse> Handle(ApplicationInviteVerifyCommand request, CancellationToken ct);
        public Task<ApplicationInviteListResponse> Handle(ApplicationInviteListQuery request, CancellationToken ct);
        public Task<Unit> Handle(ApplicationInviteDeleteCommand request, CancellationToken ct);
        public Task<ApplicationListResponse> Handle(ApplicationListQuery request, CancellationToken ct);
        public Task<ApplicationCreateResponse> Handle(ApplicationCreateCommand request, CancellationToken ct);
        public Task<ApplicationStatisticsResponse> Handle(ApplicationStatisticsQuery request, CancellationToken ct);
        public Task<Unit> Handle(IdentityCommand request, CancellationToken ct);
        public Task<BulkHistoryListResponse> Handle(GetBulkUploadHistoryQuery request, CancellationToken ct);
        public Task<BulkUploadCreateResponse> Handle(BulkUploadCreateCommand cmd, CancellationToken ct);
        public Task<ClearanceListResponse> Handle(ClearanceListQuery request, CancellationToken ct);
        public Task<Unit> Handle(ClearanceAccessDeleteCommand request, CancellationToken ct);
        public Task<ClearanceLetterResponse> Handle(ClearanceLetterQuery query, CancellationToken ct);
    }

    #region application invites
    public record ApplicationInviteCreateCommand(ApplicationInvitesCreateRequest ApplicationInvitesCreateRequest, Guid OrgId, Guid UserId) : IRequest<ApplicationInvitesCreateResponse>;
    public record ApplicationInviteListQuery() : IRequest<ApplicationInviteListResponse>
    {
        public AppInviteListFilterBy? FilterBy { get; set; }
        public AppInviteListSortBy? SortBy { get; set; }
        public PaginationRequest Paging { get; set; } = null!;
    };
    public record ApplicationInviteDeleteCommand(Guid OrgId, Guid ApplicationInviteId) : IRequest<Unit>;
    public record ApplicationInviteVerifyCommand(AppInviteVerifyRequest AppInvitesVerifyRequest) : IRequest<AppInviteVerifyResponse>;
    public record AppInviteListFilterBy(Guid OrgId, string? EmailOrNameContains);
    public record AppInviteListSortBy(bool? SubmittedDateDesc);
    public record AppInviteVerifyRequest(string InviteEncryptedCode);
    public record AppInviteVerifyResponse
    {
        public Guid OrgId { get; set; }
        public string? OrganizationName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? AddressCity { get; set; }
        public string? AddressCountry { get; set; }
        public string? AddressPostalCode { get; set; }
        public string? AddressProvince { get; set; }
        public string? EmployeeOrganizationTypeCode { get; set; }
        public string? VolunteerOrganizationTypeCode { get; set; }
        public PayeePreferenceTypeCode PayeeType { get; set; }
    };

    public record IdentityCommand(Guid OrgId, Guid ApplicationId, IdentityStatusCode Status) : IRequest<Unit>;
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
        public PayeePreferenceTypeCode PayeeType { get; set; }
    }
    public record ApplicationInviteCreateRequest() : ApplicationInvite;
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
        Completed, //inactive Status code, no use
        Cancelled,//inactive Status code, no use
        Expired //inactive Status code, no use
    }
    #endregion

    #region application
    public record ApplicationCreateCommand(ApplicationCreateRequest ApplicationCreateRequest, Guid OrgId, Guid UserId, IFormFile ConsentFormFile) : IRequest<ApplicationCreateResponse>;
    public record ApplicationListQuery : IRequest<ApplicationListResponse>
    {
        public AppListFilterBy? FilterBy { get; set; } //null means no filter
        public AppListSortBy? SortBy { get; set; } //null means no sorting
        public PaginationRequest Paging { get; set; } = null!;
    };
    public record ApplicationStatisticsQuery(Guid OrganizationId) : IRequest<ApplicationStatisticsResponse>;
    public record AppListFilterBy(Guid OrgId)
    {
        public IEnumerable<ApplicationPortalStatusCode>? ApplicationPortalStatus { get; set; }
        public string? NameOrEmailOrAppIdContains { get; set; }
    }
    public record AppListSortBy(bool? SubmittedDateDesc = true, bool? NameDesc = null, bool? CompanyNameDesc = null);
    public abstract record Application
    {
        public Guid OrgId { get; set; }
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }
        public string? EmailAddress { get; set; }
        public string? JobTitle { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? ContractedCompanyName { get; set; }
        public PayeePreferenceTypeCode PayeeType { get; set; }
    }
    public record ApplicationCreateRequest : Application
    {
        public ApplicationOriginTypeCode OriginTypeCode { get; set; }
        public string? PhoneNumber { get; set; }
        public string? DriversLicense { get; set; }
        public string? BirthPlace { get; set; }
        public GenderCode? GenderCode { get; set; }
        public ScreeningTypeCode? ScreeningTypeCode { get; set; }
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

    public record ApplicationStatisticsResponse
    {
        public IReadOnlyDictionary<ApplicationPortalStatisticsCode, int> Statistics { get; set; } = new Dictionary<ApplicationPortalStatisticsCode, int>();
    }

    public record ApplicationResponse : Application
    {
        public Guid Id { get; set; }
        public string? ApplicationNumber { get; set; }
        public bool? HaveVerifiedIdentity { get; set; }
        public PayeePreferenceTypeCode? PaidBy { get; set; }
        public DateTimeOffset? CreatedOn { get; set; }
        public ApplicationPortalStatusCode? Status { get; set; }
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
        ClosedJudicialReview,
        ClosedNoResponse,
        ClosedNoConsent,
        CancelledByApplicant,
        CancelledByOrganization
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
        ClosedJudicialReview,
        ClosedNoResponse,
        ClosedNoConsent,
        CancelledByApplicant,
        CancelledByOrganization,
        ClearedLastSevenDays,
        NotClearedLastSevenDays
    }

    public enum ApplicationOriginTypeCode
    {
        [Description("Portal")]
        Portal,

        [Description("Email")]
        Email,

        [Description("Web Form")]
        WebForm,

        [Description("Mail")]
        Mail,

        [Description("Fax")]
        Fax,

        [Description("Generic Upload")]
        GenericUpload,

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

    public enum PayeePreferenceTypeCode
    {
        [Description("Organization")]
        Organization,

        [Description("Applicant")]
        Applicant
    }

    public enum ScreeningTypeCode
    {
        [Description("Staff")]
        Staff,

        [Description("Contractor/Licensee")]
        Contractor
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
        public string? LicenceNo { get; set; }
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
    public record ClearanceListQuery : IRequest<ClearanceListResponse>
    {
        public ClearanceListFilterBy? FilterBy { get; set; } //null means no filter
        public ClearanceListSortBy? SortBy { get; set; } //null means no sorting
        public PaginationRequest Paging { get; set; } = null!;
    }
    public record ClearanceListFilterBy(Guid OrgId)
    {
        public string? NameOrEmailContains { get; set; }
    }
    public record ClearanceListSortBy(bool? ExpiresOn = true, bool? NameDesc = null, bool? CompanyNameDesc = null);
    public record ClearanceListResponse
    {
        public IEnumerable<ClearanceResponse> Clearances { get; set; } = Array.Empty<ClearanceResponse>();
        public PaginationResponse Pagination { get; set; } = null!;
    }
    public record ClearanceResponse
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

    public record ClearanceLetterQuery(Guid ClearanceId) : IRequest<ClearanceLetterResponse>;

    public record ClearanceLetterResponse
    {
        public string ContentType { get; set; } = null!;
        public byte[] Content { get; set; } = Array.Empty<byte>();
    }
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

            RuleFor(r => r.PayeeType)
                .IsInEnum();
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
                 .MaximumLength(15)
                 .NotEmpty();

            RuleFor(r => r.DateOfBirth)
                .NotEmpty()
                .Must(birth => birth.Value.AddYears(13) < DateTimeOffset.UtcNow)
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

            RuleFor(r => r.PostalCode)
                    .NotEmpty()
                    .MinimumLength(5)
                    .MaximumLength(20);

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

            RuleFor(r => r.DriversLicense)
                .MaximumLength(15);

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
                .MaximumLength(75);

            RuleFor(r => r.PhoneNumber)
                    .NotEmpty();

            RuleFor(r => r.DateOfBirth)
                    .NotEmpty();

            RuleFor(r => r.BirthPlace)
                    .NotEmpty();

            RuleFor(r => r.JobTitle)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.ScreeningTypeCode)
                    .IsInEnum();

            RuleFor(r => r.ContractedCompanyName)
                    .NotEmpty()
                    .When(r => r.ScreeningTypeCode == ScreeningTypeCode.Contractor);

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
        }
    }
    #endregion



    #region shared
    public record PaginationRequest(int Page, int PageSize);
    public record PaginationResponse
    {
        public int PageSize { get; set; }
        public int PageIndex { get; set; }
        public int Length { get; set; }
    }
    public enum GenderCode
    {
        [Description("Male")]
        M,
        [Description("Female")]
        F,
        [Description("Non-Binary")]
        X
    }
    #endregion
}
