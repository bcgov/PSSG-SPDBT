using Spd.Resource.Repository.DogBase;

namespace Spd.Resource.Repository.DogTrainerApp;
public interface IDogTrainerAppRepository : IDogAppBaseRepository
{
    public Task<DogTrainerAppCmdResp> CreateDogTrainerAppAsync(CreateDogTrainerAppCmd cmd, CancellationToken ct);
    public Task<DogTrainerAppResp> GetDogTrainerAppAsync(Guid appId, CancellationToken ct);
}

public record DogTrainerAppCmdResp(Guid LicenceAppId, Guid ContactId);

public record DogTrainerApp
{
    public ServiceTypeEnum? ServiceTypeCode { get; set; }
    public ApplicationTypeEnum? ApplicationTypeCode { get; set; }
    public LicenceTermEnum? LicenceTermCode { get; set; } //for biz licence term, only 1,2,3 year
    public ApplicationOriginTypeEnum ApplicationOriginTypeCode { get; set; } = ApplicationOriginTypeEnum.WebForm;
    public bool? AgreeToCompleteAndAccurate { get; set; } = true;
    public Guid AccreditedSchoolId { get; set; }
    public string? AccreditedSchoolName { get; set; }
    public string? SchoolDirectorSurname { get; set; }
    public string? SchoolDirectorGivenName { get; set; }
    public string? SchoolDirectorMiddleName { get; set; }
    public string? SchoolContactPhoneNumber { get; set; }
    public string? SchoolContactEmailAddress { get; set; }

    //trainer info
    public string? TrainerSurname { get; set; }
    public string? TrainerGivenName { get; set; }
    public string? TrainerMiddleName { get; set; }
    public MailingAddr? TrainerMailingAddress { get; set; }
    public DateOnly? TrainerDateOfBirth { get; set; }
    public string? TrainerPhoneNumber { get; set; }
    public string? TrainerEmailAddress { get; set; }
}

public record CreateDogTrainerAppCmd() : DogTrainerApp
{
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
    public Guid? OriginalApplicationId { get; set; }
    public Guid? OriginalLicenceId { get; set; }
    public Guid? ApplicantId { get; set; }
};

public record DogTrainerAppResp : DogTrainerApp
{
    public Guid LicenceAppId { get; set; }
    public Guid? ApplicantId { get; set; }
    public string? CaseNumber { get; set; }
    public ApplicationPortalStatusEnum? ApplicationPortalStatus { get; set; }
}