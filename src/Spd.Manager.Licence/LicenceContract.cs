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

public record LicenceQuery(string? LicenceNumber, string? AccessCode) : IRequest<LicenceResponse>;
public record ApplicantLicenceListQuery(Guid ApplicantId) : IRequest<IEnumerable<LicenceResponse>>;
public record LicencePhotoQuery(Guid LicenceId) : IRequest<FileResponse>;
