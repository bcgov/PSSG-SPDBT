using MediatR;

namespace Spd.Manager.Licence;
public interface IBodyArmorAppManager
{
    public Task<BodyArmorAppCommandResponse> Handle(AnonymousBodyArmorAppNewCommand command, CancellationToken ct);
    public Task<BodyArmorAppCommandResponse> Handle(AnonymousBodyArmorAppReplaceCommand command, CancellationToken ct);
    public Task<BodyArmorAppCommandResponse> Handle(AnonymousBodyArmorAppRenewCommand command, CancellationToken ct);
    public Task<BodyArmorAppCommandResponse> Handle(AnonymousBodyArmorAppUpdateCommand command, CancellationToken ct);
}


public record AnonymousBodyArmorAppNewCommand(
    BodyArmorAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<BodyArmorAppCommandResponse>;

public record AnonymousBodyArmorAppReplaceCommand(
    BodyArmorAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<BodyArmorAppCommandResponse>;

public record AnonymousBodyArmorAppRenewCommand(
    BodyArmorAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<BodyArmorAppCommandResponse>;

public record AnonymousBodyArmorAppUpdateCommand(
    BodyArmorAppAnonymousSubmitRequestJson LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<BodyArmorAppCommandResponse>;

#region anonymous user

public record BodyArmorAppAnonymousSubmitRequestJson : PersonalLicenceAppBase //for anonymous user
{
    public IEnumerable<DocumentExpiredInfo> DocumentExpiredInfos { get; set; } = Enumerable.Empty<DocumentExpiredInfo>();
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public IEnumerable<Guid>? PreviousDocumentIds { get; set; } //documentUrlId, used for renew
    public Guid? OriginalApplicationId { get; set; } //for new, it should be null. for renew, replace, update, it should be original application id. 
    public Guid? OriginalLicenceId { get; set; } //for new, it should be null. for renew, replace, update, it should be original licence id. 
    public bool? Reprint { get; set; }
}

public record BodyArmorAppCommandResponse : LicenceAppUpsertResponse;
#endregion




