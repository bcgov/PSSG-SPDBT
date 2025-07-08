using Spd.Resource.Repository.DogBase;

namespace Spd.Resource.Repository.GDSDApp;
public interface IGDSDAppRepository : IDogAppBaseRepository
{
    public Task<GDSDAppCmdResp> CreateGDSDAppAsync(CreateGDSDAppCmd cmd, CancellationToken ct);
    public Task<GDSDAppCmdResp> SaveGDSDAppAsync(SaveGDSDAppCmd cmd, CancellationToken ct);
    public Task<GDSDAppResp> GetGDSDAppAsync(Guid licenceAppId, CancellationToken ct);
}

public record GDSDAppCmdResp(Guid LicenceAppId, Guid ContactId);

public record GDSDApp
{
    public ServiceTypeEnum? ServiceTypeCode { get; set; }
    public ApplicationTypeEnum? ApplicationTypeCode { get; set; }
    public LicenceTermEnum? LicenceTermCode { get; set; } //for biz licence term, only 1,2,3 year
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
    public bool? IsDogTrainedByAccreditedSchool { get; set; }

    //for app with accredited school
    public AccreditedSchoolQuestions? AccreditedSchoolQuestions { get; set; } //not null if it is New

    //for app without accredited school
    public NonAccreditedSchoolQuestions? NonAccreditedSchoolQuestions { get; set; } //not null if it is New
}

public record DogInfo
{
    public string? DogName { get; set; }
    public DateOnly? DogDateOfBirth { get; set; }
    public string? DogBreed { get; set; }
    public string? DogColorAndMarkings { get; set; }
    public GenderEnum? DogGender { get; set; }
    public string? MicrochipNumber { get; set; }
}
public record AccreditedSchoolQuestions
{
    public bool? IsGuideDog { get; set; } // True for Guide Dog, False for Service Dog
    public string? ServiceDogTasks { get; set; }
    public GraduationInfo? GraduationInfo { get; set; } //not null if it is New
}
public record NonAccreditedSchoolQuestions
{
    public bool? AreInoculationsUpToDate { get; set; }
    public bool? DoctorIsProvidingNeedDogMedicalForm { get; set; }
    public bool? IsDogSterilized { get; set; }
    public TrainingInfo? TrainingInfo { get; set; } //not null if it is New
}
public record GraduationInfo
{
    public Guid? AccreditedSchoolId { get; set; }
    public string? AccreditedSchoolName { get; set; }
    public string? SchoolContactSurname { get; set; }
    public string? SchoolContactGivenName { get; set; }
    public string? SchoolContactEmailAddress { get; set; }
    public string? SchoolContactPhoneNumber { get; set; }
}
public record TrainingInfo
{
    public bool? HasAttendedTrainingSchool { get; set; }
    public IEnumerable<TrainingSchoolInfo>? SchoolTrainings { get; set; } //have value when HasAttendedTrainingSchool=true
    public IEnumerable<OtherTraining>? OtherTrainings { get; set; } //have value when HasAttendedTrainingSchool=false
    public string? SpecializedTasksWhenPerformed { get; set; }
}

public record TrainingSchoolInfo
{
    public Guid? TrainingId { get; set; }
    public string? TrainingBizName { get; set; }
    public Addr? TrainingBizMailingAddress { get; set; }
    public string? ContactSurname { get; set; }
    public string? ContactGivenName { get; set; }
    public string? ContactEmailAddress { get; set; }
    public string? ContactPhoneNumber { get; set; }
    public decimal? TotalTrainingHours { get; set; }
    public DateOnly? TrainingStartDate { get; set; }
    public DateOnly? TrainingEndDate { get; set; }
    public string? TrainingName { get; set; } //Name and/or type of training program
    public string? WhatLearned { get; set; }
}

public record OtherTraining
{
    public Guid? TrainingId { get; set; }
    public string? TrainingDetail { get; set; }
    public bool? UsePersonalDogTrainer { get; set; }
    public string? DogTrainerCredential { get; set; }
    public string? TrainingTime { get; set; } //? //How much time was spent training?
    public string? TrainerSurname { get; set; }
    public string? TrainerGivenName { get; set; }
    public string? TrainerEmailAddress { get; set; }
    public string? TrainerPhoneNumber { get; set; }
    public string? HoursPracticingSkill { get; set; } //How many hours did you spend practising the skills learned? (e.g. 20 hours/week for 8 weeks) 
}

public record SaveGDSDAppCmd() : GDSDApp
{
    public Guid? LicenceAppId { get; set; }
    public Guid ApplicantId { get; set; }
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
}

public record CreateGDSDAppCmd() : GDSDApp
{
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
    public Guid? OriginalApplicationId { get; set; }
    public Guid? OriginalLicenceId { get; set; }
    public Guid? ApplicantId { get; set; }
    public bool IsAssistanceStillRequired { get; set; }
    public Guid? DogId { get; set; }
};

public record GDSDAppResp() : GDSDApp
{
    public Guid? LicenceAppId { get; set; }
    public string? CaseNumber { get; set; }
    public ApplicationPortalStatusEnum? ApplicationPortalStatus { get; set; }
}

