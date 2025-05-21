using Spd.Resource.Repository.DogBase;
using Spd.Resource.Repository.GDSDApp;

namespace Spd.Resource.Repository.RetiredDogApp;
public interface IRetiredDogAppRepository : IDogAppBaseRepository
{
    public Task<RetiredDogAppCmdResp> CreateRetiredDogAppAsync(CreateRetiredDogAppCmd cmd, CancellationToken ct);
    public Task<RetiredDogAppCmdResp> SaveRetiredDogAppAsync(SaveRetiredDogAppCmd cmd, CancellationToken ct);
    public Task<RetiredDogAppResp> GetRetiredDogAppAsync(Guid licenceAppId, CancellationToken ct);
}

public record RetiredDogAppCmdResp(Guid LicenceAppId, Guid ContactId);

public record RetiredDogApp
{
    public ServiceTypeEnum? ServiceTypeCode { get; set; } = ServiceTypeEnum.RetiredServiceDogCertification;
    public ApplicationTypeEnum? ApplicationTypeCode { get; set; }
    public LicenceTermEnum? LicenceTermCode { get; set; } //for dog lic, only 2 years
    public ApplicationOriginTypeEnum ApplicationOriginTypeCode { get; set; } = ApplicationOriginTypeEnum.Portal;
    public bool? AgreeToCompleteAndAccurate { get; set; } = true;

    //personal info
    public string? Surname { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName { get; set; }
    public Addr? MailingAddress { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
    public string? ApplicantOrLegalGuardianName { get; set; }

    public DogInfo? DogInfo { get; set; }
    public string? CurrentGDSDCertificateNumber { get; set; }
    public DateOnly? DogRetiredDate { get; set; }
    public bool? ConfirmDogLiveWithYouAfterRetire { get; set; }
}



public record SaveRetiredDogAppCmd() : RetiredDogApp
{
    public Guid? LicenceAppId { get; set; }
    public Guid ApplicantId { get; set; }
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
}

public record CreateRetiredDogAppCmd() : RetiredDogApp
{
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
    public Guid? OriginalApplicationId { get; set; }
    public Guid? OriginalLicenceId { get; set; }
    public Guid? ApplicantId { get; set; }
    public Guid? DogId { get; set; }
};

public record RetiredDogAppResp() : RetiredDogApp
{
    public Guid? LicenceAppId { get; set; }
    public string? CaseNumber { get; set; }
    public Guid ApplicantId { get; set; }
    public ApplicationPortalStatusEnum? ApplicationPortalStatus { get; set; }
}

