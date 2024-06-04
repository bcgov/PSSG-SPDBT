using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.PersonLicApplication;

namespace Spd.Resource.Repository.LicApp;
public partial interface ILicAppRepository
{
    public Task<IEnumerable<LicenceAppListResp>> QueryAsync(LicenceAppQuery qry, CancellationToken cancellationToken);
}

public record LicenceAppQuery(Guid? ApplicantId, Guid? BizId, List<WorkerLicenceTypeEnum>? ValidWorkerLicenceTypeCodes, List<ApplicationPortalStatusEnum>? ValidPortalStatus);

public record LicenceAppListResp
{
    public Guid LicenceAppId { get; set; }
    public WorkerLicenceTypeEnum WorkerLicenceTypeCode { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset? SubmittedOn { get; set; }
    public DateTimeOffset? UpdatedOn { get; set; }
    public ApplicationTypeEnum ApplicationTypeCode { get; set; }
    public string CaseNumber { get; set; }
    public ApplicationPortalStatusEnum ApplicationPortalStatusCode { get; set; }
}




