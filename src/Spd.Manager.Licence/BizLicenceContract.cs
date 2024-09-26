using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public interface IBizLicenceManager
{
    public Task<BizLicenceCommandResponse> Handle(BizLicenceReplaceCommand command, CancellationToken ct);
    public Task<BizLicenceCommandResponse> Handle(BizLicenceRenewCommand command, CancellationToken ct);
    public Task<BizLicenceCommandResponse> Handle(BizLicenceUpdateCommand command, CancellationToken ct);
}

public record BizLicenceReplaceCommand(
    //BizLicenceReplaceRequest LicenceRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<BizLicenceCommandResponse>;

public record BizLicenceRenewCommand(
    //BizLicenceRenewRequest LicenceRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<BizLicenceCommandResponse>;

public record BizLicenceUpdateCommand(
    BizLicenceUpdateRequest BizLicenceUpdateRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<BizLicenceCommandResponse>;

public record BizLicenceRequest
{
    public IEnumerable<Guid>? NewDocumentCacheKeyCodes { get; set; } //for new documents uploaded in update/renew/unauth, saved in cache
    public IEnumerable<Guid>? ValidPreviousDocumentIds { get; set; } //documentUrlId, used for update/renew/
    public Guid OriginalLicenceId { get; set; } //for renew, replace, update licence it should be original licence id. 
    public ApplicationOriginTypeCode ApplicationOriginTypeCode { get; set; } = ApplicationOriginTypeCode.Portal;
}

public record BizLicenceUpdateRequest : BizLicenceRequest
{
    public Guid BizId { get; set; }
    public LicenceTermCode? LicenceTermCode { get; set; } //for biz licence term, only 1,2,3 year
    public bool? UseDogs { get; set; }
    public bool? IsDogsPurposeProtection { get; set; }
    public bool? IsDogsPurposeDetectionDrugs { get; set; }
    public bool? IsDogsPurposeDetectionExplosives { get; set; }
    public IEnumerable<WorkerCategoryTypeCode> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeCode>();
}

public record BizLicenceCommandResponse
{
    public Guid BizId { get; set; }
    public decimal? Cost { get; set; }
}

