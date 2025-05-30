﻿using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.PersonLicApplication;

namespace Spd.Resource.Repository.BizLicApplication;
public partial interface IBizLicApplicationRepository
{
    public Task<BizLicApplicationCmdResp> CreateBizLicApplicationAsync(CreateBizLicApplicationCmd cmd, CancellationToken ct);
    public Task<BizLicApplicationCmdResp> SaveBizLicApplicationAsync(SaveBizLicApplicationCmd cmd, CancellationToken ct);
    public Task<BizLicApplicationResp> GetBizLicApplicationAsync(Guid licenceApplicationId, CancellationToken ct);
    public Task CancelDraftApplicationAsync(Guid applicationId, CancellationToken ct);
}

public record BizLicApplicationCmdResp(Guid LicenceAppId, Guid AccountId);

public record BizLicApplication
{
    public ServiceTypeEnum ServiceTypeCode { get; set; }
    public ApplicationTypeEnum ApplicationTypeCode { get; set; }
    public BizTypeEnum? BizTypeCode { get; set; }
    public ApplicationOriginTypeEnum? ApplicationOriginTypeCode { get; set; } = ApplicationOriginTypeEnum.Portal;
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public string? EmailAddress { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ManagerGivenName { get; set; }
    public string? ManagerMiddleName1 { get; set; }
    public string? ManagerMiddleName2 { get; set; }
    public string? ManagerSurname { get; set; }
    public string? ManagerEmailAddress { get; set; }
    public string? ManagerPhoneNumber { get; set; }
    public string? ExpiredLicenceNumber { get; set; }
    public bool? ApplicantIsBizManager { get; set; }
    public LicenceTermEnum? LicenceTermCode { get; set; }
    public bool? NoBranding { get; set; }
    public bool? UseDogs { get; set; }
    public bool? IsDogsPurposeProtection { get; set; }
    public bool? IsDogsPurposeDetectionDrugs { get; set; }
    public bool? IsDogsPurposeDetectionExplosives { get; set; }
    public IEnumerable<WorkerCategoryTypeEnum> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeEnum>();
    public IEnumerable<UploadedDocumentEnum>? UploadedDocumentEnums { get; set; }
    public PrivateInvestigatorSwlContactInfo? PrivateInvestigatorSwlInfo { get; set; }
    public bool? AgreeToCompleteAndAccurate { get; set; }
    public Guid? SubmittedByPortalUserId { get; set; }
    public Guid? ApplicantSwlLicenceId { get; set; } //for sole proprietor (registered or non-registered) 
}

public record SaveBizLicApplicationCmd() : BizLicApplication
{
    public Guid? LicenceAppId { get; set; }
    public Guid ApplicantId { get; set; }
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
    public Guid? ExpiredLicenceId { get; set; }
    public bool? HasExpiredLicence { get; set; }
}

public record CreateBizLicApplicationCmd() : BizLicApplication
{
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
    public Guid? OriginalApplicationId { get; set; }
    public Guid? OriginalLicenceId { get; set; }
    public string? ChangeSummary { get; set; }
};

public record BizLicApplicationResp() : BizLicApplication
{
    public Guid? BizId { get; set; }
    public Guid? LicenceAppId { get; set; }
    public Guid? ContactId { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public ApplicationPortalStatusEnum? ApplicationPortalStatus { get; set; }
    public string? CaseNumber { get; set; }
    public LicenceTermEnum? OriginalLicenceTermCode { get; set; }
    public Guid? ExpiredLicenceId { get; set; }
    public bool? HasExpiredLicence { get; set; }
    public Guid? SoleProprietorSWLAppId { get; set; } //sole proprietor swl appliation id, for sole proprietor combo flow
    public IEnumerable<Guid> NonSwlControllingMemberCrcAppIds { get; set; }
    public ApplicationOriginTypeEnum SoleProprietorSWLAppOriginTypeCode { get; set; }
}

public record PrivateInvestigatorSwlContactInfo : ContactInfo
{
    public Guid? ContactId { get; set; }
    public Guid? BizContactId { get; set; }
    public Guid? LicenceId { get; set; }
}

public enum PositionEnum
{
    PrivateInvestigatorManager,
    Manager,
    Director,
    Officer,
    OwnerOperator,
    VotingShareholder,
    NonVotingShareholder,
    Trustee,
    Partner
}