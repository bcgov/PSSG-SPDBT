using MediatR;

namespace Spd.Manager.Licence;
public interface IPermitAppManager
{
    public Task<PermitAppCommandResponse> Handle(PermitAppNewCommand command, CancellationToken ct);
    public Task<PermitAppCommandResponse> Handle(PermitAppReplaceCommand command, CancellationToken ct);
    public Task<PermitAppCommandResponse> Handle(PermitAppRenewCommand command, CancellationToken ct);
    public Task<PermitAppCommandResponse> Handle(PermitAppUpdateCommand command, CancellationToken ct);
    public Task<PermitLicenceAppResponse> Handle(GetPermitApplicationQuery query, CancellationToken ct);
    public Task<PermitAppCommandResponse> Handle(PermitUpsertCommand command, CancellationToken ct);
    public Task<PermitAppCommandResponse> Handle(PermitSubmitCommand command, CancellationToken ct);
}

public record PermitLicenceAppBase : PersonalLicenceAppBase
{
    public string? PermitOtherRequiredReason { get; set; }
    public string? EmployerName { get; set; }
    public string? SupervisorName { get; set; }
    public string? SupervisorEmailAddress { get; set; }
    public string? SupervisorPhoneNumber { get; set; }
    public Address? EmployerPrimaryAddress { get; set; }
    public string? Rationale { get; set; }
    public bool? IsCanadianResident { get; set; }
    public IEnumerable<BodyArmourPermitReasonCode> BodyArmourPermitReasonCodes { get; set; } = []; //for body armour
    public IEnumerable<ArmouredVehiclePermitReasonCode> ArmouredVehiclePermitReasonCodes { get; set; } = []; // for armour vehicle
}

#region authenticated user
public record PermitUpsertCommand(PermitAppUpsertRequest PermitUpsertRequest) : IRequest<PermitAppCommandResponse>;
public record PermitSubmitCommand(PermitAppUpsertRequest PermitUpsertRequest)
    : PermitUpsertCommand(PermitUpsertRequest), IRequest<PermitAppCommandResponse>;

public record PermitAppUpsertRequest : PermitLicenceAppBase
{
    public IEnumerable<Document>? DocumentInfos { get; set; }
    public Guid? LicenceAppId { get; set; }
    public Guid ApplicantId { get; set; }
};

#endregion

#region anonymous user
public record PermitAppNewCommand(
    PermitAppSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<PermitAppCommandResponse>;

public record PermitAppReplaceCommand(
    PermitAppSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<PermitAppCommandResponse>;

public record PermitAppRenewCommand(
    PermitAppSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<PermitAppCommandResponse>;

public record PermitAppUpdateCommand(
    PermitAppSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<PermitAppCommandResponse>;

public record GetPermitApplicationQuery(Guid LicenceApplicationId) : IRequest<PermitLicenceAppResponse>;

public record PermitAppSubmitRequest : PermitLicenceAppBase
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public IEnumerable<Guid>? PreviousDocumentIds { get; set; } //documentUrlId, used for renew
    public Guid? OriginalApplicationId { get; set; } //for new, it should be null. for renew, replace, update, it should be original application id. 
    public Guid? OriginalLicenceId { get; set; } //for new, it should be null. for renew, replace, update, it should be original licence id. 
    public bool? Reprint { get; set; }
    public string? CriminalChargeDescription { get; set; }
}

public record PermitAppCommandResponse : LicenceAppUpsertResponse
{
    public decimal? Cost { get; set; }
};

public record PermitLicenceAppResponse : PermitLicenceAppBase
{
    public Guid LicenceAppId { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? CaseNumber { get; set; }
    public string? ExpiredLicenceNumber { get; set; }
    public ApplicationPortalStatusCode? ApplicationPortalStatus { get; set; }
    public IEnumerable<Document> DocumentInfos { get; set; } = Enumerable.Empty<Document>();
}

public enum BodyArmourPermitReasonCode
{
    PersonalProtection,
    MyEmployment,
    OutdoorRecreation,
    TravelInResponseToInternationalConflict,
    Other
}

public enum ArmouredVehiclePermitReasonCode
{
    ProtectionOfPersonalProperty, //armoured vehicle
    ProtectionOfOtherProperty, //armoured vehicle
    ProtectionOfAnotherPerson, //armoured vehicle
    PersonalProtection, //armoured vehicle
    MyEmployment,//armoured vehicle
    Other
}
#endregion




