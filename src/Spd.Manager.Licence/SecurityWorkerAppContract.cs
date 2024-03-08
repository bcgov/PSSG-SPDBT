using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public interface ISecurityWorkerAppManager
{
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceUpsertCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceSubmitCommand command, CancellationToken ct);
    public Task<WorkerLicenceAppResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct);
    public Task<IEnumerable<WorkerLicenceAppListResponse>> Handle(GetWorkerLicenceAppListQuery query, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceAppNewCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceAppReplaceCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceAppRenewCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceAppUpdateCommand command, CancellationToken ct);
}

public record WorkerLicenceUpsertCommand(WorkerLicenceAppUpsertRequest LicenceUpsertRequest, string? BcscGuid = null) : IRequest<WorkerLicenceCommandResponse>;
public record WorkerLicenceSubmitCommand(WorkerLicenceAppUpsertRequest LicenceUpsertRequest, string? BcscGuid = null)
    : WorkerLicenceUpsertCommand(LicenceUpsertRequest, BcscGuid), IRequest<WorkerLicenceCommandResponse>;

public record AnonymousWorkerLicenceAppNewCommand(
    WorkerLicenceAppAnonymousSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<WorkerLicenceCommandResponse>;

public record AnonymousWorkerLicenceAppReplaceCommand(
    WorkerLicenceAppAnonymousSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<WorkerLicenceCommandResponse>;

public record AnonymousWorkerLicenceAppRenewCommand(
    WorkerLicenceAppAnonymousSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<WorkerLicenceCommandResponse>;

public record AnonymousWorkerLicenceAppUpdateCommand(
    WorkerLicenceAppAnonymousSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<WorkerLicenceCommandResponse>;

public record GetWorkerLicenceQuery(Guid LicenceApplicationId) : IRequest<WorkerLicenceAppResponse>;
public record GetWorkerLicenceAppListQuery(Guid ApplicantId) : IRequest<IEnumerable<WorkerLicenceAppListResponse>>;

public record WorkerLicenceAppResponse : WorkerLicenceAppBase
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

public record WorkerLicenceAppBase : PersonalLicenceAppBase
{
    public bool? CarryAndUseRestraints { get; set; }
    public bool? UseDogs { get; set; }
    public bool? IsDogsPurposeProtection { get; set; }
    public bool? IsDogsPurposeDetectionDrugs { get; set; }
    public bool? IsDogsPurposeDetectionExplosives { get; set; }
    public IEnumerable<WorkerCategoryTypeCode> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeCode>();
    public bool? IsPoliceOrPeaceOfficer { get; set; }
    public PoliceOfficerRoleCode? PoliceOfficerRoleCode { get; set; }
    public string? OtherOfficerRole { get; set; }
    public bool? IsTreatedForMHC { get; set; }
    public bool? HasNewMentalHealthCondition { get; set; }
}

#region authenticated user
public record WorkerLicenceAppUpsertRequest : WorkerLicenceAppBase
{
    public IEnumerable<Document>? DocumentInfos { get; set; }
    public Guid? LicenceAppId { get; set; }
};

public record WorkerLicenceAppSubmitRequest : WorkerLicenceAppUpsertRequest;

public record WorkerLicenceCommandResponse : LicenceAppUpsertResponse
{
    public decimal? Cost { get; set; }
};


#endregion

#region anonymous user

public record WorkerLicenceAppAnonymousSubmitRequest : WorkerLicenceAppBase //for anonymous user
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public IEnumerable<Guid>? PreviousDocumentIds { get; set; } //documentUrlId, used for renew
    public Guid? OriginalApplicationId { get; set; } //for new, it should be null. for renew, replace, update, it should be original application id. 
    public Guid? OriginalLicenceId { get; set; } //for new, it should be null. for renew, replace, update, it should be original licence id. 
    public bool? Reprint { get; set; }
    public string? CriminalChargeDescription { get; set; }
}

#endregion


public record Document : LicenceAppDocumentResponse
{
    public LicenceDocumentTypeCode? LicenceDocumentTypeCode { get; set; }
    public DateOnly? ExpiryDate { get; set; }
};



