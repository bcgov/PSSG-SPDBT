using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public interface ILicenceManager
{
    public Task<IEnumerable<LicenceResponse>> Handle(LicenceQuery query, CancellationToken ct);
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
    public string? LicenceHolderFirstName { get; set; }
    public string? LicenceHolderLastName { get; set; }
};

public record LicenceQuery(string? LicenceNumber, string? AccessCode, Guid? applicantId = null) : IRequest<IEnumerable<LicenceResponse>>;
public record LicencePhotoQuery(Guid LicenceId) : IRequest<FileResponse>;
