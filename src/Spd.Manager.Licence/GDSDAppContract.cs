using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public interface IGDSDAppManager
{
    //anonymous
    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppAnonymousSubmitCommand command, CancellationToken ct);

    //auth
    public Task<GDSDTeamLicenceAppResponse> Handle(GDSDTeamLicenceApplicationQuery query, CancellationToken ct);
    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppUpsertCommand command, CancellationToken ct);
    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppSubmitCommand command, CancellationToken ct);
    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppReplaceCommand command, CancellationToken ct);
    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppRenewCommand command, CancellationToken ct);
}

#region authenticated
public record GDSDTeamLicenceAppUpsertCommand(GDSDTeamLicenceAppUpsertRequest UpsertRequest) : IRequest<GDSDAppCommandResponse>;
public record GDSDTeamLicenceAppSubmitCommand(GDSDTeamLicenceAppUpsertRequest UpsertRequest) : GDSDTeamLicenceAppUpsertCommand(UpsertRequest), IRequest<GDSDAppCommandResponse>;
public record GDSDTeamLicenceAppReplaceCommand(GDSDTeamLicenceAppChangeRequest UpsertRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<GDSDAppCommandResponse>;
public record GDSDTeamLicenceAppRenewCommand(GDSDTeamLicenceAppChangeRequest ChangeRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<GDSDAppCommandResponse>;
public record GDSDTeamLicenceApplicationQuery(Guid LicenceApplicationId) : IRequest<GDSDTeamLicenceAppResponse>;
#endregion

#region anonymous
public record GDSDTeamLicenceAppAnonymousSubmitCommand(GDSDTeamLicenceAppAnonymousSubmitRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<GDSDAppCommandResponse>;
#endregion

public record GDSDTeamLicenceAppBase : LicenceAppBase
{
    //personal info
    public string? Surname { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName { get; set; }
    public MailingAddress? MailingAddress { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
    public string? ApplicantOrLegalGuardianName { get; set; }
    public IEnumerable<DocumentRelatedInfo> DocumentRelatedInfos { get; set; } = Enumerable.Empty<DocumentRelatedInfo>();

    public bool? IsDogTrainedByAccreditedSchool { get; set; }
    public DogInfoRenew? DogInfoRenew { get; set; } //not null if it is Renew

    //for app with accredited school
    public DogInfoNewAccreditedSchool? DogInfoNewAccreditedSchool { get; set; } //not null if it is New
    public GraduationInfo? GraduationInfo { get; set; } //not null if it is New

    //for app without accredited school
    public DogInfoNewWithoutAccreditedSchool? DogInfoNewWithoutAccreditedSchool { get; set; } //not null if it is New
    public TrainingInfo? TrainingInfo { get; set; } //not null if it is New
}

public record GDSDTeamLicenceAppUpsertRequest : GDSDTeamLicenceAppBase
{
    public IEnumerable<Document>? DocumentInfos { get; set; }
    public Guid? LicenceAppId { get; set; }
    public Guid ApplicantId { get; set; }
}

public record GDSDTeamLicenceAppAnonymousSubmitRequest : GDSDTeamLicenceAppBase
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
}

public record GDSDTeamLicenceAppChangeRequest : GDSDTeamLicenceAppBase
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public Guid OriginalLicenceId { get; set; } //for renew, replace, it should be original licence id.
    public Guid ApplicantId { get; set; }
}

public record GDSDTeamLicenceAppResponse : GDSDTeamLicenceAppBase
{
    public IEnumerable<Document> DocumentInfos { get; set; } = Enumerable.Empty<Document>();
    public Guid? LicenceAppId { get; set; }
    public string? CaseNumber { get; set; }
    public ApplicationPortalStatusCode? ApplicationPortalStatus { get; set; }
}

public record GDSDAppCommandResponse
{
    public Guid? LicenceAppId { get; set; }
}

public record DogInfoNew
{
    // Dog Information (New)
    public string? DogName { get; set; }
    public DateOnly? DogDateOfBirth { get; set; }
    public string? DogBreed { get; set; }
    public string? DogColorAndMarkings { get; set; }
    public GenderCode? DogGender { get; set; } //only Male and Female?If it is fixed, what should it be.
    public string? MicrochipNumber { get; set; }
}
public record DogInfoNewAccreditedSchool : DogInfoNew
{
    public bool? IsGuideDog { get; set; } // True for Guide Dog, False for Service Dog
    public string? ServiceDogTasks { get; set; }
}
public record DogInfoNewWithoutAccreditedSchool : DogInfoNew
{
    public bool? AreInoculationsUpToDate { get; set; }
}
public record GraduationInfo
{
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
    public MailingAddress? TrainingBizMailingAddress { get; set; }
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
public record DogInfoRenew
{
    public bool IsAssistanceStillRequired { get; set; }
    public Guid? DogId { get; set; }
}

