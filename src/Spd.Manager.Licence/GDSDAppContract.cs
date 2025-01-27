using MediatR;

namespace Spd.Manager.Licence;
public interface IGDSDAppManager
{
    //anonymous
    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppAnonymousSubmitCommand command, CancellationToken ct);

    //auth
    public Task<GDSDTeamLicenceAppResponse> Handle(GDSDTeamLicenceApplicationQuery query, CancellationToken ct);
    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppUpsertCommand command, CancellationToken ct);
    public Task<GDSDAppCommandResponse> Handle(GDSDTeamLicenceAppSubmitCommand command, CancellationToken ct);
}

#region authenticated
public record GDSDTeamLicenceAppUpsertCommand(GDSDTeamLicenceAppUpsertRequest UpsertRequest) : IRequest<GDSDAppCommandResponse>;
public record GDSDTeamLicenceAppSubmitCommand(GDSDTeamLicenceAppUpsertRequest UpsertRequest) : IRequest<GDSDAppCommandResponse>;
public record GDSDTeamLicenceApplicationQuery(Guid LicenceApplicationId) : IRequest<GDSDTeamLicenceAppResponse>;
#endregion

#region anonymous
public record GDSDTeamLicenceAppAnonymousSubmitCommand(GDSDTeamLicenceAppAnonymousSubmitRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<GDSDAppCommandResponse>;
#endregion

public record GDSDTeamLicenceAppBase : LicenceAppBase
{
    //personal info
    public string Surname { get; set; }
    public string LegalGivenName { get; set; }
    public string MiddleName { get; set; }
    public MailingAddress MailingAddress { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string ContactPhoneNumber { get; set; }
    public string ContactEmail { get; set; }

    public bool DogTrainedByAccreditSchool { get; set; }
    public DogInfoRenew? DogInfoRenew { get; set; } //not null if it is Renew

    //for app with accredit school
    public DogInfoNewCreditSchool? DogInfoNewCreditSchool { get; set; } //not null if it is New
    public GraduationInfo? GraduationInfo { get; set; } //not null if it is New

    //for app without accredit school
    public DogInfoNewWithoutCreditSchool? DogInfoNewWithoutCreditSchool { get; set; } //not null if it is New
    public TraningInfo? TraingInfo { get; set; } //not null if it is New
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
    public bool IsGuideDog { get; set; } // True for Guide Dog, False for Service Dog
    public string DogName { get; set; }
    public DateOnly DogDateOfBirth { get; set; }
    public string DogBreed { get; set; }
    public string DogColorAndMarkings { get; set; }
    public string DogGender { get; set; } //only Male and Female?If it is fixed, what should it be.
    public string MicrochipNumber { get; set; }
    public string ServiceDogTasks { get; set; }
}
public record DogInfoNewCreditSchool : DogInfoNew
{
    public bool IsGuideDog { get; set; } // True for Guide Dog, False for Service Dog
    public string ServiceDogTasks { get; set; }
}
public record DogInfoNewWithoutCreditSchool : DogInfoNew
{
    public bool AreInoculationsUpToDate { get; set; }
}
public record GraduationInfo
{
    public string AccreditedSchoolName { get; set; }
    public string SchoolContactSurname { get; set; }
    public string SchoolContactFirstName { get; set; }
    public string SchoolContactEmail { get; set; }
    public string SchoolContactPhone { get; set; }
}
public record TraningInfo
{
    public string SpecializedTasks { get; set; }
    public string WhenPerform { get; set; }

    //If you attended a training school(s) and/or program(s), //is training school repeating?
    public string TrainingBizName { get; set; }
    public MailingAddress TrainingBizMailingAddress { get; set; }
    public string TrainingBizContactSurname { get; set; }
    public string TrainingBizContactFirstName { get; set; }
    public string TrainingBizContactEmail { get; set; }
    public string TrainingBizContactPhone { get; set; }
    public int TotalTrainingHours { get; set; }
    public string TrainingDates { get; set; } //? change to from to
    public string TrainingName { get; set; } //Name and/or type of training program
    public string WhatLearned { get; set; }

    //If you did not attend a training school or formalized training program, is other repeating?
    public string TrainingDetail { get; set; }
    public bool UsePersonalDogTrainer { get; set; }
    public string DogTrainerCredential { get; set; }
    public string TrainingTime { get; set; } //? //How much time was spent training?
    public string TrainerSurname { get; set; }
    public string TrainerFirstName { get; set; }
    public string TrainerEmail { get; set; }
    public string TrainerPhone { get; set; }
    public string HoursPractisingSkill { get; set; } //How many hours did you spend practising the skills learned? (e.g. 20 hours/week for 8 weeks) 
}
public record DogInfoRenew
{
    public string DogName { get; set; }
    public string CurrentDogCertificate { get; set; }
    public bool AssistanceStillRequired { get; set; }
}

