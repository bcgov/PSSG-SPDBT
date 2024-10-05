using Spd.Resource.Repository.PersonLicApplication;

namespace Spd.Resource.Repository.LicenceFee;
public partial interface ILicenceFeeRepository
{
    public Task<LicenceFeeListResp> QueryAsync(LicenceFeeQry query, CancellationToken cancellationToken);
}


public record LicenceFeeQry
{
    public ServiceTypeEnum? WorkerLicenceTypeEnum { get; set; } = null;
    public LicenceTermEnum? LicenceTermEnum { get; set; } = null;
    public ApplicationTypeEnum? ApplicationTypeEnum { get; set; } = null;
    public BizTypeEnum? BizTypeEnum { get; set; } = null;
    public bool IncludeInactive { get; set; } = false;
    public bool? HasValidSwl90DayLicence { get; set; } = null;
};

public record LicenceFeeResp()
{
    public ServiceTypeEnum? WorkerLicenceTypeCode { get; set; }
    public BizTypeEnum? BizTypeCode { get; set; }
    public ApplicationTypeEnum? ApplicationTypeCode { get; set; }
    public LicenceTermEnum? LicenceTermCode { get; set; }
    public bool HasValidSwl90DayLicence { get; set; }
    public decimal? Amount { get; set; }
}

public record LicenceFeeListResp
{
    public IEnumerable<LicenceFeeResp> LicenceFees { get; set; } = Array.Empty<LicenceFeeResp>();
}


