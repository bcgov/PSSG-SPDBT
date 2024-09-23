using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public interface ISecurityWorkerAppManager
{
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceUpsertCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceSubmitCommand command, CancellationToken ct);
    public Task<WorkerLicenceAppResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct);
    public Task<Guid> Handle(GetLatestWorkerLicenceApplicationIdQuery query, CancellationToken ct);
    public Task<IEnumerable<LicenceAppListResponse>> Handle(GetLicenceAppListQuery query, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceAppNewCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceAppReplaceCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceAppRenewCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceAppUpdateCommand command, CancellationToken ct);
}

public record WorkerLicenceUpsertCommand(WorkerLicenceAppUpsertRequest LicenceUpsertRequest) : IRequest<WorkerLicenceCommandResponse>;
public record WorkerLicenceSubmitCommand(WorkerLicenceAppUpsertRequest LicenceUpsertRequest)
    : WorkerLicenceUpsertCommand(LicenceUpsertRequest), IRequest<WorkerLicenceCommandResponse>;

public record WorkerLicenceAppNewCommand(
    WorkerLicenceAppSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<WorkerLicenceCommandResponse>;

public record WorkerLicenceAppReplaceCommand(
    WorkerLicenceAppSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos, 
    bool IsAuthenticated = false)
    : IRequest<WorkerLicenceCommandResponse>;

public record WorkerLicenceAppRenewCommand(
    WorkerLicenceAppSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos,
    bool IsAuthenticated = false)
    : IRequest<WorkerLicenceCommandResponse>;

public record WorkerLicenceAppUpdateCommand(
    WorkerLicenceAppSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos,
    bool IsAuthenticated = false)
    : IRequest<WorkerLicenceCommandResponse>;

public record GetWorkerLicenceQuery(Guid LicenceApplicationId) : IRequest<WorkerLicenceAppResponse>;
public record GetLatestWorkerLicenceApplicationIdQuery(Guid ApplicantId) : IRequest<Guid>;
public record GetLicenceAppListQuery(Guid ApplicantId) : IRequest<IEnumerable<LicenceAppListResponse>>;

public record WorkerLicenceAppResponse : WorkerLicenceAppBase
{
    public Guid LicenceAppId { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? CaseNumber { get; set; }
    public string? ExpiredLicenceNumber { get; set; }
    public ApplicationPortalStatusCode? ApplicationPortalStatus { get; set; }
    public IEnumerable<Document> DocumentInfos { get; set; } = Enumerable.Empty<Document>();
    public Guid? SoleProprietorBizAppId { get; set; } //this is for sole-proprietor biz application id for combo app
}

public record LicenceAppListResponse
{
    public Guid LicenceAppId { get; set; }
    public WorkerLicenceTypeCode ServiceTypeCode { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset? SubmittedOn { get; set; }
    public DateTimeOffset? UpdatedOn { get; set; }
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
    public Guid ApplicantId { get; set; }
};

public record WorkerLicenceCommandResponse : LicenceAppUpsertResponse
{
    public decimal? Cost { get; set; }
};


#endregion

#region anonymous user

public record WorkerLicenceAppSubmitRequest : WorkerLicenceAppBase
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public IEnumerable<Guid>? PreviousDocumentIds { get; set; } //documentUrlId, used for renew
    public Guid? LatestApplicationId { get; set; } //for new, it should be null. for renew, replace, update, it should be latest application id. 
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



