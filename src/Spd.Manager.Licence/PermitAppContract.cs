using MediatR;

namespace Spd.Manager.Licence;
public interface IPermitAppManager
{
    public Task<PermitAppCommandResponse> Handle(AnonymousPermitAppNewCommand command, CancellationToken ct);
    public Task<PermitAppCommandResponse> Handle(AnonymousPermitAppRenewCommand command, CancellationToken ct);
    public Task<PermitAppCommandResponse> Handle(AnonymousPermitAppUpdateCommand command, CancellationToken ct);
}

#region anonymous user
public record AnonymousPermitAppNewCommand(
    PermitAppAnonymousSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<PermitAppCommandResponse>;

public record AnonymousPermitAppRenewCommand(
    PermitAppAnonymousSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<PermitAppCommandResponse>;

public record AnonymousPermitAppUpdateCommand(
    PermitAppAnonymousSubmitRequest LicenceAnonymousRequest,
    IEnumerable<LicAppFileInfo> LicAppFileInfos)
    : IRequest<PermitAppCommandResponse>;

public record GetPermitApplicationQuery(Guid LicenseApplicationId) : IRequest<PermitLicenseAppResponse>;

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
    public IEnumerable<BodyArmourPermitReasonCode>? BodyArmourPermitReasonCodes { get; set; } //for body armour
    public IEnumerable<ArmouredVehiclePermitReasonCode>? ArmouredVehiclePermitReasonCodes { get; set; } // for armour vehicle
}

public record PermitAppCommandResponse : LicenceAppUpsertResponse
{
    public decimal? Cost { get; set; }
};

public record PermitLicenseAppResponse : PersonalLicenceAppBase
{
    public Guid LicenceAppId { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? CaseNumber { get; set; }
    public ApplicationPortalStatusCode? ApplicationPortalStatus { get; set; }
    public IEnumerable<Document> DocumentInfos { get; set; } = Enumerable.Empty<Document>();
    public string? PermitOtherRequiredReason { get; set; }
    public string? EmployerName { get; set; }
    public string? SupervisorName { get; set; }
    public string? SupervisorEmailAddress { get; set; }
    public string? SupervisorPhoneNumber { get; set; }
    public EmployerPrimaryAddress? EmployerPrimaryAddress { get; set; }
    public string? Rationale { get; set; }
    public bool? IsCanadianResident { get; set; }
    public IEnumerable<BodyArmourPermitReasonCode>? BodyArmourPermitReasonCodes { get; set; } //for body armour
    public IEnumerable<ArmouredVehiclePermitReasonCode>? ArmouredVehiclePermitReasonCodes { get; set; } // for armour vehicle
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
public record EmployerPrimaryAddress : Address;
#endregion




