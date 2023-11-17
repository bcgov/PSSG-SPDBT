using Spd.Resource.Applicants.LicenceApplication;

namespace Spd.Resource.Applicants.LicenceFee;
public partial interface ILicenceFeeRepository
{
    public Task<LicenceFeeListResp> GetLicenceFeeAsync(WorkerLicenceTypeEnum workerLicenceTypeCode, CancellationToken cancellationToken);
}


public record LicenceFeeResp()
{
    public WorkerLicenceTypeEnum? WorkerLicenceTypeCode { get; set; }
    public BusinessTypeEnum? BusinessTypeCode { get; set; }
    public ApplicationTypeEnum? ApplicationTypeCode { get; set; }
    public LicenceTermEnum? LicenceTermCode { get; set; }
    public int? Amount { get; set; }
}

public record LicenceFeeListResp
{
    public IEnumerable<LicenceFeeResp> LicenceFees { get; set; } = Array.Empty<LicenceFeeResp>();
}

