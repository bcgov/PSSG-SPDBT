using MediatR;
using Microsoft.AspNetCore.Http;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public interface ISecurityWorkerAppManager
{
    public Task<WorkerLicenceAppUpsertResponse> Handle(WorkerLicenceUpsertCommand command, CancellationToken ct);
    public Task<WorkerLicenceAppUpsertResponse> Handle(WorkerLicenceSubmitCommand command, CancellationToken ct);
    public Task<WorkerLicenceResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct);
    public Task<IEnumerable<WorkerLicenceAppListResponse>> Handle(GetWorkerLicenceAppListQuery query, CancellationToken ct);
    public Task<IEnumerable<LicenceAppDocumentResponse>> Handle(CreateLicenceAppDocumentCommand command, CancellationToken ct);
    //deprecated
    public Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceSubmitCommand command, CancellationToken ct);
    public Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceAppNewCommand command, CancellationToken ct);
    public Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceAppReplaceCommand command, CancellationToken ct);
    public Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceAppRenewCommand command, CancellationToken ct);
    public Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceAppUpdateCommand command, CancellationToken ct);
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

public record AnonymousWorkerLicenceAppNewCommand(
    WorkerLicenceAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<WorkerLicenceAppUpsertResponse>;

public record AnonymousWorkerLicenceAppReplaceCommand(
    WorkerLicenceAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<WorkerLicenceAppUpsertResponse>;

public record AnonymousWorkerLicenceAppRenewCommand(
    WorkerLicenceAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<WorkerLicenceAppUpsertResponse>;

public record AnonymousWorkerLicenceAppUpdateCommand(
    WorkerLicenceAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<WorkerLicenceAppUpsertResponse>;

public record GetWorkerLicenceQuery(Guid LicenceApplicationId) : IRequest<WorkerLicenceResponse>;
public record GetWorkerLicenceAppListQuery(Guid ApplicantId) : IRequest<IEnumerable<WorkerLicenceAppListResponse>>;

#region base data model


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


public record WorkerLicenceResponse : PersonalLicenceAppBase
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
public record WorkerLicenceAppUpsertRequest : PersonalLicenceAppBase
{
    public Document[]? DocumentInfos { get; set; }
    public Guid? LicenceAppId { get; set; }
};

public record WorkerLicenceAppSubmitRequest : WorkerLicenceAppUpsertRequest;

public record WorkerLicenceAppUpsertResponse : LicenceAppUpsertResponse;


#endregion

#region anonymous user
//for anonymous user, deprecated
public record WorkerLicenceAppAnonymousSubmitRequest : PersonalLicenceAppBase
{
    public IEnumerable<DocumentExpiredInfo> DocumentExpiredInfos { get; set; } = Array.Empty<DocumentExpiredInfo>();
    public string Recaptcha { get; set; } = null!;
}

public record WorkerLicenceAppAnonymousSubmitRequestJson : PersonalLicenceAppBase //for anonymous user
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


