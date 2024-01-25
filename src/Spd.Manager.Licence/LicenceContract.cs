using MediatR;

namespace Spd.Manager.Licence;

public interface ILicenceManager
{
    public Task<LicenceLookupResponse> Handle(LicenceLookupQuery query, CancellationToken ct);
}

public record LicenceLookupResponse
{
    public Guid? LicenceId { get; set; } = null;
    public Guid? LicenceAppId { get; set; } = null;
    public string? LicenceNumber { get; set; } = null;
    public DateOnly ExpiryDate { get; set; }
    public WorkerLicenceTypeCode? WorkerLicenceTypeCode { get; set; }
    public LicenceTermCode? LicenceTermCode { get; set; }
};

public record LicenceLookupQuery(string LicenceNumber, string AccessCode) : IRequest<LicenceLookupResponse>;
