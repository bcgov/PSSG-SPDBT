using MediatR;

namespace Spd.Manager.Licence;

public interface ILicenceManager
{
    public Task<LicenceLookupResponse> Handle(LicenceLookupQuery query, CancellationToken ct);
    public Task<LicenceLookupResponse> Handle(LicenceAccessCodeLookupQuery query, CancellationToken ct);
}

public record LicenceLookupResponse
{
    public Guid? LicenceId { get; set; } = null;
    public string? LicenceNumber { get; set; } = null;
    public DateOnly ExpiryDate { get; set; }
};

public record LicenceLookupQuery(string LicenceNumber) : IRequest<LicenceLookupResponse>;
public record LicenceAccessCodeLookupQuery(string LicenceNumber, string AccessCode) : IRequest<LicenceLookupResponse>;
