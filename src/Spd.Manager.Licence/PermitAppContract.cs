using MediatR;

namespace Spd.Manager.Licence;
public interface IPermitAppManager
{
    public Task<PermitAppCommandResponse> Handle(AnonymousPermitAppNewCommand command, CancellationToken ct);
    public Task<PermitAppCommandResponse> Handle(AnonymousPermitAppReplaceCommand command, CancellationToken ct);
    public Task<PermitAppCommandResponse> Handle(AnonymousPermitAppRenewCommand command, CancellationToken ct);
    public Task<PermitAppCommandResponse> Handle(AnonymousPermitAppUpdateCommand command, CancellationToken ct);
}

#region anonymous user
public record AnonymousPermitAppNewCommand(
    PermitAppAnonymousSubmitRequest LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<PermitAppCommandResponse>;

public record AnonymousPermitAppReplaceCommand(
    PermitAppAnonymousSubmitRequest LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<PermitAppCommandResponse>;

public record AnonymousPermitAppRenewCommand(
    PermitAppAnonymousSubmitRequest LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<PermitAppCommandResponse>;

public record AnonymousPermitAppUpdateCommand(
    PermitAppAnonymousSubmitRequest LicenceAnonymousRequest,
    Guid KeyCode)
    : IRequest<PermitAppCommandResponse>;

public record PermitAppAnonymousSubmitRequest : PersonalLicenceAppBase
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public IEnumerable<Guid>? PreviousDocumentIds { get; set; } //documentUrlId, used for renew
    public Guid? OriginalApplicationId { get; set; } //for new, it should be null. for renew, replace, update, it should be original application id. 
    public Guid? OriginalLicenceId { get; set; } //for new, it should be null. for renew, replace, update, it should be original licence id. 
    public bool? Reprint { get; set; }
    public string? PermitOtherRequiredReason { get; set; }
    public string? EmployerName { get; set; }
    public string? SupervisorName { get; set; }
    public string? SupervisorEmailAddress { get; set; }
    public string? SupervisorPhoneNumber { get; set; }
    public EmployerPrimaryAddress? EmployerPrimaryAddress { get; set; }
    public string? Rationale { get; set; }
    public bool? IsCanadianResident { get; set; }
    public IEnumerable<RequirePermitReasonCode>? RequirePermitReasonCode { get; set; }
}

public record PermitAppCommandResponse : LicenceAppUpsertResponse;

public enum RequirePermitReasonCode
{
    PersonalProtection,
    MyEmployment,
    OutdoorRecreation,
    TravelInResponseToInternationalConflict,
    Other
}
public record EmployerPrimaryAddress : Address;
#endregion




