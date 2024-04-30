using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public interface ILicenceManager
{
    public Task<LicenceResponse> Handle(LicenceQuery query, CancellationToken ct);
    public Task<IEnumerable<LicenceResponse>> Handle(ApplicantLicenceListQuery query, CancellationToken ct);
    public Task<FileResponse> Handle(LicencePhotoQuery query, CancellationToken ct);
}

public record LicenceResponse
{
    public Guid? LicenceId { get; set; }
    public Guid? LicenceAppId { get; set; }
    public string? LicenceNumber { get; set; }
    public DateOnly ExpiryDate { get; set; }
    public WorkerLicenceTypeCode? WorkerLicenceTypeCode { get; set; }
    public LicenceTermCode? LicenceTermCode { get; set; }
    public string? LicenceHolderName { get; set; }
    public Guid? LicenceHolderId { get; set; }
    public string? NameOnCard { get; set; }
    public LicenceStatusCode LicenceStatusCode { get; set; }
};

public record PermitLicenceResponse : LicenceResponse
{
    public string? PermitOtherRequiredReason { get; set; }
    public string? EmployerName { get; set; }
    public string? SupervisorName { get; set; }
    public string? SupervisorEmailAddress { get; set; }
    public string? SupervisorPhoneNumber { get; set; }
    public Address? EmployerPrimaryAddress { get; set; }
    public string? Rationale { get; set; }
    public IEnumerable<BodyArmourPermitReasonCode> BodyArmourPermitReasonCodes { get; set; } = []; //for body armour
    public IEnumerable<ArmouredVehiclePermitReasonCode> ArmouredVehiclePermitReasonCodes { get; set; } = []; // for armour vehicle
}

public record LicenceQuery(string? LicenceNumber, string? AccessCode) : IRequest<LicenceResponse>;
public record ApplicantLicenceListQuery(Guid ApplicantId) : IRequest<IEnumerable<LicenceResponse>>;
public record LicencePhotoQuery(Guid LicenceId) : IRequest<FileResponse>;
