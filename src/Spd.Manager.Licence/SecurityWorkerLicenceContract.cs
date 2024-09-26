using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public interface ISecurityWorkerLicenceManager
{
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceReplaceCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceRenewCommand command, CancellationToken ct);
    public Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceUpdateCommand command, CancellationToken ct);
}

public record WorkerLicenceReplaceCommand(
    WorkerLicenceReplaceRequest WorkerLicenceReplaceRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<WorkerLicenceCommandResponse>;

public record WorkerLicenceRenewCommand(
    WorkerLicenceRenewRequest WorkerLicenceRenewRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos,
    bool IsAuthenticated = false)
    : IRequest<WorkerLicenceCommandResponse>;

public record WorkerLicenceUpdateCommand(
    WorkerLicenceUpdateRequest WorkerLicenceUpdateRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<WorkerLicenceCommandResponse>;

public record WorkerLicenceResponse
{
    public decimal? Cost { get; set; }
};

public record WorkerLicenceRequest
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public IEnumerable<Guid>? PreviousDocumentIds { get; set; } //documentUrlId, used for renew
    public Guid OriginalLicenceId { get; set; } //for renew, replace, update licence it should be original licence id. 
    public ApplicationOriginTypeCode ApplicationOriginTypeCode { get; set; } = ApplicationOriginTypeCode.Portal;
}

public record WorkerLicenceUpdateRequest : WorkerLicenceRequest
{
    public bool? CarryAndUseRestraints { get; set; }
    public bool? UseDogs { get; set; }
    public bool? IsDogsPurposeProtection { get; set; }
    public bool? IsDogsPurposeDetectionDrugs { get; set; }
    public bool? IsDogsPurposeDetectionExplosives { get; set; }
    public IEnumerable<WorkerCategoryTypeCode> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeCode>();
    public string? CriminalChargeDescription { get; set; }
}

public record WorkerLicenceRenewRequest : WorkerLicenceRequest;
public record WorkerLicenceReplaceRequest : WorkerLicenceRequest;

