using MediatR;
using Microsoft.AspNetCore.Http;
using Spd.Manager.Shared;
using GenderCode = Spd.Manager.Shared.GenderCode;

namespace Spd.Manager.Licence;
public interface ISecurityWorkerAppManager
{
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceUpsertCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceSubmitCommand command, CancellationToken ct);
    public Task<WorkerLicenceResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct);
    public Task<IEnumerable<WorkerLicenceAppListResponse>> Handle(GetWorkerLicenceAppListQuery query, CancellationToken ct);
    public Task<IEnumerable<LicenceAppDocumentResponse>> Handle(CreateLicenceAppDocumentCommand command, CancellationToken ct);
    //deprecated
    public Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceSubmitCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceAppNewCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceAppReplaceCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceAppRenewCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceAppUpdateCommand command, CancellationToken ct);
    public Task<IEnumerable<LicAppFileInfo>> Handle(CreateDocumentInCacheCommand command, CancellationToken ct);
}

public record WorkerLicenceUpsertCommand(WorkerLicenceAppUpsertRequest LicenceUpsertRequest, string? BcscGuid = null) : IRequest<WorkerLicenceCommandResponse>;
public record WorkerLicenceSubmitCommand(WorkerLicenceAppUpsertRequest LicenceUpsertRequest, string? BcscGuid = null)
    : WorkerLicenceUpsertCommand(LicenceUpsertRequest, BcscGuid), IRequest<WorkerLicenceCommandResponse>;
//deprecated
public record AnonymousWorkerLicenceSubmitCommand(
    WorkerLicenceAppAnonymousSubmitRequest LicenceAnonymousRequest,
    ICollection<UploadFileRequest> UploadFileRequests)
    : IRequest<WorkerLicenceCommandResponse>;

public record AnonymousWorkerLicenceAppNewCommand(
    WorkerLicenceAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<WorkerLicenceCommandResponse>;

public record AnonymousWorkerLicenceAppReplaceCommand(
    WorkerLicenceAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<WorkerLicenceCommandResponse>;

public record AnonymousWorkerLicenceAppRenewCommand(
    WorkerLicenceAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<WorkerLicenceCommandResponse>;

public record AnonymousWorkerLicenceAppUpdateCommand(
    WorkerLicenceAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<WorkerLicenceCommandResponse>;

public record GetWorkerLicenceQuery(Guid LicenceApplicationId) : IRequest<WorkerLicenceResponse>;
public record GetWorkerLicenceAppListQuery(Guid ApplicantId) : IRequest<IEnumerable<WorkerLicenceAppListResponse>>;

#region base data model
public abstract record WorkerLicenceAppBase
{
    public WorkerLicenceTypeCode? WorkerLicenceTypeCode { get; set; }
    public ApplicationTypeCode? ApplicationTypeCode { get; set; }
    public BusinessTypeCode? BusinessTypeCode { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public GenderCode? GenderCode { get; set; }
    public bool? OneLegalName { get; set; }
    public string? ExpiredLicenceNumber { get; set; }
    public Guid? ExpiredLicenceId { get; set; } //for new application type, for renew, replace, update, it should be null.
    public bool? HasExpiredLicence { get; set; }  //for new application type
    public LicenceTermCode? LicenceTermCode { get; set; }
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
    public bool? AgreeToCompleteAndAccurate { get; set; }
    public bool? LegalNameChanged { get; set; }
    public IEnumerable<WorkerCategoryTypeCode> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeCode>();
}

public record DocumentExpiredInfo
{
    public LicenceDocumentTypeCode LicenceDocumentTypeCode { get; set; }
    public DateOnly? ExpiryDate { get; set; }
}
public record Document : LicenceAppDocumentResponse
{
    public LicenceDocumentTypeCode LicenceDocumentTypeCode { get; set; }
    public DateOnly? ExpiryDate { get; set; }
};

public record ResidentialAddress : Address;
public record MailingAddress : Address;

public record WorkerLicenceResponse : WorkerLicenceAppBase
{
    public Guid LicenceAppId { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? CaseNumber { get; set; }
    public ApplicationPortalStatusCode? ApplicationPortalStatus { get; set; }
    public IEnumerable<Document> DocumentInfos { get; set; } = Enumerable.Empty<Document>();
}

public record WorkerLicenceAppListResponse
{
    public Guid LicenceAppId { get; set; }
    public WorkerLicenceTypeCode ServiceTypeCode { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset? SubmittedOn { get; set; }
    public ApplicationTypeCode ApplicationTypeCode { get; set; }
    public string CaseNumber { get; set; } = null!;
    public ApplicationPortalStatusCode ApplicationPortalStatusCode { get; set; }
}
#endregion

#region authenticated user
public record WorkerLicenceAppUpsertRequest : WorkerLicenceAppBase
{
    public Document[]? DocumentInfos { get; set; }
    public Guid? LicenceAppId { get; set; }
};

public record WorkerLicenceAppSubmitRequest : WorkerLicenceAppUpsertRequest;

public record WorkerLicenceCommandResponse
{
    public Guid? LicenceAppId { get; set; }
    public decimal? Cost { get; set; }
}

#endregion

#region anonymous user
//for anonymous user, deprecated
public record WorkerLicenceAppAnonymousSubmitRequest : WorkerLicenceAppBase 
{
    public IEnumerable<DocumentExpiredInfo> DocumentExpiredInfos { get; set; } = Array.Empty<DocumentExpiredInfo>();
    public string Recaptcha { get; set; } = null!;
}

public record WorkerLicenceAppAnonymousSubmitRequestJson : WorkerLicenceAppBase //for anonymous user
{
    public IEnumerable<DocumentExpiredInfo> DocumentExpiredInfos { get; set; } = Enumerable.Empty<DocumentExpiredInfo>();
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public IEnumerable<Guid>? PreviousDocumentIds { get; set; } //documentUrlId, used for renew
    public Guid? OriginalApplicationId { get; set; } //for new, it should be null. for renew, replace, update, it should be original application id. 
    public Guid? OriginalLicenceId { get; set; } //for new, it should be null. for renew, replace, update, it should be original licence id. 
    public bool? Reprint { get; set; }
}

public record WorkerLicenceCreateResponse
{
    public Guid LicenceAppId { get; set; }
}

public record LicenceAppDocumentsCache
{
    public IEnumerable<LicAppFileInfo> Items { get; set; } = Enumerable.Empty<LicAppFileInfo>();
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
    public Guid? LicenceAppId { get; set; }
    public string? DocumentName { get; set; }
    public string? DocumentExtension { get; set; }
};

#endregion


