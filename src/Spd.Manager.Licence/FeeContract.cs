using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public interface IFeeManager
{
    public Task<LicenceFeeListResponse> Handle(GetLicenceFeeListQuery query, CancellationToken ct);
}

public record LicenceFeeResponse
{
    public ServiceTypeCode? ServiceTypeCode { get; set; }
    public BizTypeCode? BizTypeCode { get; set; }
    public ApplicationTypeCode? ApplicationTypeCode { get; set; }
    public LicenceTermCode? LicenceTermCode { get; set; }
    public bool? HasValidSwl90DayLicence { get; set; }
    public int? Amount { get; set; }
};

public record LicenceFeeListResponse
{
    public IEnumerable<LicenceFeeResponse> LicenceFees { get; set; } = Array.Empty<LicenceFeeResponse>();
}

public record GetLicenceFeeListQuery(ServiceTypeCode? ServiceTypeCode) : IRequest<LicenceFeeListResponse>;
