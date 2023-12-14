using MediatR;
using Microsoft.AspNetCore.Http;
using Spd.Resource.Applicants.Application;
using GenderCode = Spd.Utilities.Shared.ManagerContract.GenderCode;

namespace Spd.Manager.Licence;
public interface IPersonalLicenceAppManager
{
    public Task<WorkerLicenceAppUpsertResponse> Handle(WorkerLicenceUpsertCommand command, CancellationToken ct);
    public Task<WorkerLicenceAppUpsertResponse> Handle(WorkerLicenceSubmitCommand command, CancellationToken ct);
    public Task<WorkerLicenceResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct);
    public Task<IEnumerable<WorkerLicenceAppListResponse>> Handle(GetWorkerLicenceAppListQuery query, CancellationToken ct);
    public Task<IEnumerable<LicenceAppDocumentResponse>> Handle(CreateLicenceAppDocumentCommand command, CancellationToken ct);
    public Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceSubmitCommand command, CancellationToken ct);
    public Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceAppSubmitCommand command, CancellationToken ct);
    public Task<IEnumerable<LicAppFileInfo>> Handle(CreateDocumentInCacheCommand command, CancellationToken ct);
}

public record WorkerLicenceUpsertCommand(WorkerLicenceAppUpsertRequest LicenceUpsertRequest, string? BcscGuid = null) : IRequest<WorkerLicenceAppUpsertResponse>;
public record WorkerLicenceSubmitCommand(WorkerLicenceAppUpsertRequest LicenceUpsertRequest, string? BcscGuid = null)
    : WorkerLicenceUpsertCommand(LicenceUpsertRequest, BcscGuid), IRequest<WorkerLicenceAppUpsertResponse>;
//deprecated
public record AnonymousWorkerLicenceSubmitCommand(
    WorkerLicenceAppAnonymousSubmitRequest LicenceAnonymousRequest,
    ICollection<UploadFileRequest> UploadFileRequests)
    : IRequest<WorkerLicenceAppUpsertResponse>;
//

public record AnonymousWorkerLicenceAppSubmitCommand(
    WorkerLicenceAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<WorkerLicenceAppUpsertResponse>;

public record GetWorkerLicenceQuery(Guid LicenceApplicationId) : IRequest<WorkerLicenceResponse>;
public record GetWorkerLicenceAppListQuery(Guid ApplicantId) : IRequest<IEnumerable<WorkerLicenceAppListResponse>>;

#region base data model
public abstract record WorkerLicenceAppBase
{
    public WorkerLicenceTypeCode? WorkerLicenceTypeCode { get; set; }
    public ApplicationTypeCode? ApplicationTypeCode { get; set; }
    public bool? isSoleProprietor { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public GenderCode? GenderCode { get; set; }
    public bool? OneLegalName { get; set; }
    public string? ExpiredLicenceNumber { get; set; }
    public Guid? ExpiredLicenceId { get; set; }
    public bool? HasExpiredLicence { get; set; }
    public LicenceTermCode? LicenceTermCode { get; set; }
    public bool? HasCriminalHistory { get; set; }
    public bool? HasPreviousName { get; set; }
    public Alias[]? Aliases { get; set; }
    public bool? HasBcDriversLicence { get; set; }
    public string? BcDriversLicenceNumber { get; set; }
    public HairColourCode? HairColourCode { get; set; }
    public EyeColourCode? EyeColourCode { get; set; }
    public int? Height { get; set; }
    public HeightUnitCode? HeightUnitCode { get; set; }
    public int? Weight { get; set; }
    public WeightUnitCode? WeightUnitCode { get; set; }
    public string? ContactEmailAddress { get; set; }
    public string? ContactPhoneNumber { get; set; }
    public bool? IsMailingTheSameAsResidential { get; set; }
    public ResidentialAddress? ResidentialAddressData { get; set; }
    public MailingAddress? MailingAddressData { get; set; }
    public bool? IsPoliceOrPeaceOfficer { get; set; }
    public PoliceOfficerRoleCode? PoliceOfficerRoleCode { get; set; }
    public string? OtherOfficerRole { get; set; }
    public bool? IsTreatedForMHC { get; set; }
    public bool? UseBcServicesCardPhoto { get; set; }
    public bool? CarryAndUseRestraints { get; set; }
    public bool? UseDogs { get; set; }
    public bool? IsDogsPurposeProtection { get; set; }
    public bool? IsDogsPurposeDetectionDrugs { get; set; }
    public bool? IsDogsPurposeDetectionExplosives { get; set; }
    public bool? IsCanadianCitizen { get; set; }

}
public record WorkerLicenceApp : WorkerLicenceAppBase //for authenticated user
{
    public WorkerLicenceAppCategoryData[] CategoryData { get; set; } = Array.Empty<WorkerLicenceAppCategoryData>();
    public PoliceOfficerDocument? PoliceOfficerDocument { get; set; }
    public MentalHealthDocument? MentalHealthDocument { get; set; }
    public FingerprintProofDocument? FingerprintProofDocument { get; set; }
    public CitizenshipDocument? CitizenshipDocument { get; set; }
    public AdditionalGovIdDocument? AdditionalGovIdDocument { get; set; }
    public IdPhotoDocument? IdPhotoDocument { get; set; }
}

public record WorkerLicenceAppCategoryData
{
    public WorkerCategoryTypeCode WorkerCategoryTypeCode { get; set; }
    public Document[]? Documents { get; set; } = null;
}
public record DocumentBase
{
    public LicenceDocumentTypeCode LicenceDocumentTypeCode { get; set; }
    public DateOnly? ExpiryDate { get; set; }
}
public record Document : DocumentBase
{
    public LicenceAppDocumentResponse[]? DocumentResponses { get; set; } //for authenticated user
}
public record PoliceOfficerDocument : Document;
public record MentalHealthDocument : Document;
public record FingerprintProofDocument : Document;
public record CitizenshipDocument : Document;
public record AdditionalGovIdDocument : Document;
public record IdPhotoDocument : Document;
public record ResidentialAddress : Address;
public record MailingAddress : Address;
public abstract record Address
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

public record WorkerLicenceResponse : WorkerLicenceApp
{
    public Guid LicenceAppId { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? CaseNumber { get; set; }
    public ApplicationPortalStatusCode? ApplicationPortalStatus { get; set; }
}

public record WorkerLicenceAppListResponse
{
    public Guid LicenceAppId { get; set; }
    public WorkerLicenceTypeCode ServiceTypeCode { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset? SubmittedOn { get; set; }
    public ApplicationTypeCode ApplicationTypeCode { get; set; }
    public string CaseNumber { get; set; }
    public ApplicationPortalStatusCode ApplicationPortalStatusCode { get; set; }
}
#endregion

#region authenticated user
public record WorkerLicenceAppUpsertRequest : WorkerLicenceApp
{
    public Guid? LicenceAppId { get; set; }
};

public record WorkerLicenceAppSubmitRequest : WorkerLicenceAppUpsertRequest;

public record WorkerLicenceAppUpsertResponse
{
    public Guid LicenceAppId { get; set; }
}

#endregion

#region anonymous user
public record WorkerLicenceAppAnonymousSubmitRequest : WorkerLicenceAppBase //for anonymous user, deprecated
{
    public WorkerCategoryTypeCode[] CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeCode>();
    public DocumentBase[]? DocumentInfos { get; set; }
    public string Recaptcha { get; set; } = null!;
}

public record WorkerLicenceAppAnonymousSubmitRequestJson : WorkerLicenceAppBase //for anonymous user
{
    public WorkerCategoryTypeCode[] CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeCode>();
    public DocumentBase[]? DocumentInfos { get; set; }
}

public record WorkerLicenceCreateResponse
{
    public Guid LicenceAppId { get; set; }
}

public record LicenceAppDocumentsCache
{
    public List<LicAppFileInfo> LicAppFileInfos { get; set; } = new List<LicAppFileInfo>();
}
public record LicAppFileInfo
{
    public LicenceDocumentTypeCode LicenceDocumentTypeCode { get; set; }
    public string? TempFileKey { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public long FileSize { get; set; } = 0;
}
#endregion

#region file upload
public record CreateLicenceAppDocumentCommand(LicenceAppDocumentUploadRequest Request, string? BcscId, Guid AppId) : IRequest<IEnumerable<LicenceAppDocumentResponse>>;
public record CreateDocumentInCacheCommand(LicenceAppDocumentUploadRequest Request) : IRequest<IEnumerable<LicAppFileInfo>>;

public record LicenceAppDocumentUploadRequest(
    IList<IFormFile> Documents,
    LicenceDocumentTypeCode LicenceDocumentTypeCode
);
public record LicenceAppDocumentResponse
{
    public Guid DocumentUrlId { get; set; }
    public DateTimeOffset UploadedDateTime { get; set; }
    public Guid? LicenceAppId { get; set; } = null;
    public string? DocumentName { get; set; }
    public string? DocumentExtension { get; set; }
};

#endregion


