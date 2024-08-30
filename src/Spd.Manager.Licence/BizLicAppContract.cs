using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public interface IBizLicAppManager
{
    public Task<BizLicAppResponse> Handle(GetBizLicAppQuery query, CancellationToken ct);
    public Task<BizLicAppResponse> Handle(GetLatestBizLicenceAppQuery query, CancellationToken ct);
    public Task<BizLicAppCommandResponse> Handle(BizLicAppUpsertCommand command, CancellationToken ct);
    public Task<BizLicAppCommandResponse> Handle(BizLicAppSubmitCommand command, CancellationToken ct);
    public Task<BizLicAppCommandResponse> Handle(BizLicAppReplaceCommand command, CancellationToken ct);
    public Task<BizLicAppCommandResponse> Handle(BizLicAppRenewCommand command, CancellationToken ct);
    public Task<BizLicAppCommandResponse> Handle(BizLicAppUpdateCommand command, CancellationToken ct);
    public Task<IEnumerable<LicenceAppListResponse>> Handle(GetBizLicAppListQuery cmd, CancellationToken ct);
    public Task<FileResponse> Handle(BrandImageQuery qry, CancellationToken ct);
}

public record BizLicAppUpsertCommand(BizLicAppUpsertRequest BizLicAppUpsertRequest) : IRequest<BizLicAppCommandResponse>;
public record BizLicAppSubmitCommand(BizLicAppUpsertRequest BizLicAppUpsertRequest)
    : BizLicAppUpsertCommand(BizLicAppUpsertRequest), IRequest<BizLicAppCommandResponse>;
public record GetBizLicAppQuery(Guid LicenceApplicationId) : IRequest<BizLicAppResponse>;
public record GetLatestBizLicenceAppQuery(Guid BizId) : IRequest<BizLicAppResponse>;
public record GetBizLicAppListQuery(Guid BizId) : IRequest<IEnumerable<LicenceAppListResponse>>;
public record BizLicAppReplaceCommand(
    BizLicAppSubmitRequest LicenceRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<BizLicAppCommandResponse>;

public record BizLicAppRenewCommand(
    BizLicAppSubmitRequest LicenceRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<BizLicAppCommandResponse>;

public record BizLicAppUpdateCommand(
    BizLicAppSubmitRequest LicenceRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<BizLicAppCommandResponse>;

public record BrandImageQuery(Guid DocumentId) : IRequest<FileResponse>;

public record BizLicAppUpsertRequest : BizLicenceApp
{
    public Guid? LicenceAppId { get; set; }
    public Guid BizId { get; set; }
    public Guid? ExpiredLicenceId { get; set; }
    public bool? HasExpiredLicence { get; set; }

    // Contains branding, insurance, registrar, security dog certificate and BC report documents
    public IEnumerable<Document>? DocumentInfos { get; set; }
};

public record BizLicAppSubmitRequest : BizLicenceApp
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public IEnumerable<Guid>? PreviousDocumentIds { get; set; } //documentUrlId, used for renew
    public Guid? LatestApplicationId { get; set; } //for new, it should be null. for renew, replace, update, it should be latest application id. 
    public Guid? OriginalApplicationId { get; set; } //for new, it should be null. for renew, replace, update, it should be original application id. 
    public Guid? OriginalLicenceId { get; set; } //for new, it should be null. for renew, replace, update, it should be original licence id. 
    public bool? Reprint { get; set; }
}
public record BizLicAppCommandResponse : LicenceAppUpsertResponse
{
    public decimal? Cost { get; set; }
};
public record BizLicAppResponse : BizLicenceApp
{
    public Guid? BizId { get; set; }
    public Guid LicenceAppId { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? CaseNumber { get; set; } //application number
    public ApplicationPortalStatusCode? ApplicationPortalStatus { get; set; }
    public Guid? ExpiredLicenceId { get; set; }
    public bool? HasExpiredLicence { get; set; }
    public bool? ApplicantIsBizManager { get; set; }

    // Contains branding, insurance, registrar, security dog certificate and BC report documents
    public IEnumerable<Document>? DocumentInfos { get; set; }
}

public abstract record BizLicenceApp : LicenceAppBase
{
    //branding
    public bool? NoBranding { get; set; } //wait
    public bool? UseDogs { get; set; } //has value if SecurityGuard is selected

    //non sole proprietor properties
    public ContactInfo? ApplicantContactInfo { get; set; }
    public Members? Members { get; set; }
    public IEnumerable<WorkerCategoryTypeCode> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeCode>(); //todo: Matrix
    public PrivateInvestigatorSwlContactInfo? PrivateInvestigatorSwlInfo { get; set; } //it does not put into spd_businesscontact, so no id for it
    public bool? AgreeToCompleteAndAccurate { get; set; }
    public bool? ApplicantIsBizManager { get; set; }
    public Guid? SoleProprietorSWLAppId { get; set; } //for swl apply for sole proprietor, they need to input swl app id here.
}

public record NonSwlContactInfo : ContactInfo
{
    public Guid? BizContactId { get; set; }
    public NonSwlControllingMemberStatusCode NonSwlControllingMemberStatusCode { get; set; } = NonSwlControllingMemberStatusCode.ControllingMemberAdded;
}

public record PrivateInvestigatorSwlContactInfo : ContactInfo
{
    public Guid? ContactId { get; set; }
    public Guid? BizContactId { get; set; }
    public Guid? LicenceId { get; set; }
}
