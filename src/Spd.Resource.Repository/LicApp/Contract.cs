namespace Spd.Resource.Repository.LicApp;
public partial interface ILicAppRepository
{
    public Task<IEnumerable<LicenceAppListResp>> QueryAsync(LicenceAppQuery qry, CancellationToken cancellationToken);
    //connect spd_application with spd_contact and update application to correct status
    public Task<LicenceApplicationCmdResp> CommitLicenceApplicationAsync(Guid applicationId, ApplicationStatusEnum status, decimal? price, CancellationToken ct, LicenceTermEnum? term = null);
}

public record LicenceAppQuery(Guid? ApplicantId, Guid? BizId, List<ServiceTypeEnum>? ValidServiceTypeCodes, List<ApplicationPortalStatusEnum>? ValidPortalStatus, Guid? ApplicationId = null);

public record LicenceAppListResp
{
    public Guid LicenceAppId { get; set; }
    public ServiceTypeEnum ServiceTypeCode { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset? SubmittedOn { get; set; }
    public DateTimeOffset? UpdatedOn { get; set; }
    public ApplicationTypeEnum ApplicationTypeCode { get; set; }
    public string CaseNumber { get; set; }
    public ApplicationPortalStatusEnum ApplicationPortalStatusCode { get; set; }
}

public record LicenceApplicationCmdResp(Guid LicenceAppId, Guid? ContactId = null, Guid? BizId = null);