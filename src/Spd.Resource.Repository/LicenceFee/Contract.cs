using Spd.Resource.Repository.PersonLicApplication;

namespace Spd.Resource.Repository.LicenceFee;
public partial interface ILicenceFeeRepository
{
    public Task<LicenceFeeListResp> QueryAsync(LicenceFeeQry query, CancellationToken cancellationToken);
}


public record LicenceFeeQry
{
    public WorkerLicenceType? WorkerLicenceTypeEnum { get; set; } = null;
    public LicenceTerm? LicenceTermEnum { get; set; } = null;
    public ApplicationType? ApplicationTypeEnum { get; set; } = null;
    public BizType? BizTypeEnum { get; set; } = null;
    public bool IncludeInactive { get; set; } = false;
    public bool? HasValidSwl90DayLicence { get; set; } = null;
};

public record LicenceFeeResp()
{
    public WorkerLicenceType? WorkerLicenceTypeCode { get; set; }
    public BizType? BizTypeCode { get; set; }
    public ApplicationType? ApplicationTypeCode { get; set; }
    public LicenceTerm? LicenceTermCode { get; set; }
    public bool HasValidSwl90DayLicence { get; set; }
    public decimal? Amount { get; set; }
}

public record LicenceFeeListResp
{
    public IEnumerable<LicenceFeeResp> LicenceFees { get; set; } = Array.Empty<LicenceFeeResp>();
}


