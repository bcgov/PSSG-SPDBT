using MediatR;

namespace Spd.Manager.Licence;

public interface IFeeManager
{
    public Task<LicenceFeeListResponse> Handle(GetLicenceFeeListQuery query, CancellationToken ct);
}

public record LicenceFeeResponse
{
    public WorkerLicenceTypeCode? WorkerLicenceTypeCode { get; set; }
    public BusinessTypeCode? BusinessTypeCode { get; set; }
    public ApplicationTypeCode? ApplicationTypeCode { get; set; }
    public LicenceTermCode? LicenceTermCode { get; set; }
    public bool? HasValidSwl90DayLicence { get; set; }
    public int? Amount { get; set; }
};

public record LicenceFeeListResponse
{
    public IEnumerable<LicenceFeeResponse> LicenceFees { get; set; } = Array.Empty<LicenceFeeResponse>();
}

public record GetLicenceFeeListQuery(WorkerLicenceTypeCode? WorkerLicenceTypeCode) : IRequest<LicenceFeeListResponse>;
