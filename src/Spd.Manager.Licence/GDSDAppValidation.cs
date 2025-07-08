using FluentValidation;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public class GDSDTeamLicenceAppUpsertRequestValidator : GDSDTeamLicenceAppNewValidator<GDSDTeamLicenceAppUpsertRequest>
{
    public GDSDTeamLicenceAppUpsertRequestValidator()
    {
        RuleFor(r => r.ApplicantId).NotEmpty();
    }
}

public class GDSDTeamLicenceAppAnonymousSubmitRequestValidator : GDSDTeamLicenceAppBaseValidator<GDSDTeamLicenceAppAnonymousSubmitRequest>
{
}

public class GDSDTeamLicenceAppChangeRequestValidator : GDSDTeamLicenceAppBaseValidator<GDSDTeamLicenceAppChangeRequest>
{
    public GDSDTeamLicenceAppChangeRequestValidator()
    {
        RuleFor(r => r.ApplicantId).NotEmpty();
        RuleFor(r => r.OriginalLicenceId).NotEmpty();
        RuleFor(r => r.DogId).NotEmpty();
    }
}

public class GDSDTeamLicenceAppBaseValidator<T> : AbstractValidator<T> where T : GDSDTeamLicenceAppBase
{
    public GDSDTeamLicenceAppBaseValidator()
    {
        RuleFor(r => r.ServiceTypeCode).Must(t => t == ServiceTypeCode.GDSDTeamCertification); //must be team, dog trainer or retired dog
        RuleFor(r => r.ApplicationTypeCode).NotEmpty();
        RuleFor(r => r.Surname).MaximumLength(40).NotEmpty();
        RuleFor(r => r.GivenName).MaximumLength(40);
        RuleFor(r => r.MiddleName).MaximumLength(40);
        RuleFor(r => r.DateOfBirth).NotNull().NotEmpty().Must(d => d > new DateOnly(1800, 1, 1));
        RuleFor(r => r.PhoneNumber).MaximumLength(30).NotEmpty();
        RuleFor(r => r.EmailAddress).EmailAddress().MaximumLength(75).When(r => !string.IsNullOrWhiteSpace(r.EmailAddress));
        RuleFor(r => r.ApplicantOrLegalGuardianName).MaximumLength(80).NotEmpty()
            .When(r => r.ApplicationTypeCode == ApplicationTypeCode.New || r.ApplicationTypeCode == ApplicationTypeCode.Renewal);
        RuleFor(r => r.MailingAddress).SetValidator(new MailingAddressValidator())
            .When(r => r.MailingAddress != null);
        RuleFor(r => r.DogInfo).SetValidator(new DogInfoValidator())
            .When(r => r.DogInfo != null);
    }
}

public class GDSDTeamLicenceAppNewValidator<T> : AbstractValidator<T> where T : GDSDTeamLicenceAppNew
{
    public GDSDTeamLicenceAppNewValidator()
    {
        Include(new GDSDTeamLicenceAppBaseValidator<T>());
        RuleFor(r => r.IsDogTrainedByAccreditedSchool).NotNull().When(r => r.ApplicationTypeCode == ApplicationTypeCode.New);
        RuleFor(r => r.AccreditedSchoolQuestions).NotEmpty()
            .When(r => r.IsDogTrainedByAccreditedSchool != null && r.IsDogTrainedByAccreditedSchool.Value);
        RuleFor(r => r.AccreditedSchoolQuestions)
            .SetValidator(new AccreditedSchoolQuestionsValidator())
            .When(r => r.AccreditedSchoolQuestions != null && r.ApplicationTypeCode == ApplicationTypeCode.New);

        RuleFor(r => r.NonAccreditedSchoolQuestions).NotEmpty()
            .When(r => r.IsDogTrainedByAccreditedSchool != null && !r.IsDogTrainedByAccreditedSchool.Value);
        RuleFor(r => r.NonAccreditedSchoolQuestions)
            .SetValidator(new NonAccreditedSchoolQuestionsValidator())
            .When(r => r.NonAccreditedSchoolQuestions != null && r.IsDogTrainedByAccreditedSchool != null && !r.IsDogTrainedByAccreditedSchool.Value && r.ApplicationTypeCode == ApplicationTypeCode.New);
    }
}
public class DogInfoValidator : AbstractValidator<DogInfo>
{
    public DogInfoValidator()
    {
        RuleFor(x => x.DogName).NotEmpty().MaximumLength(50);
        RuleFor(r => r.DogDateOfBirth).NotNull().NotEmpty().Must(d => d > new DateOnly(1800, 1, 1));
        RuleFor(r => r.DogBreed).NotEmpty().MaximumLength(50);
        RuleFor(r => r.DogGender).Must(t => t == GenderCode.M || t == GenderCode.F);
        RuleFor(x => x.MicrochipNumber).MaximumLength(50);
        RuleFor(r => r.DogColorAndMarkings).MaximumLength(50);
    }
}

public class AccreditedSchoolQuestionsValidator : AbstractValidator<AccreditedSchoolQuestions>
{
    public AccreditedSchoolQuestionsValidator()
    {
        RuleFor(r => r.GraduationInfo).NotEmpty();

        RuleFor(r => r.GraduationInfo)
            .SetValidator(new GraduationInfoValidator())
            .When(r => r.GraduationInfo != null);
        RuleFor(r => r.ServiceDogTasks).MaximumLength(1000);
        RuleFor(r => r.IsGuideDog).NotNull();
    }
}

public class NonAccreditedSchoolQuestionsValidator : AbstractValidator<NonAccreditedSchoolQuestions>
{
    public NonAccreditedSchoolQuestionsValidator()
    {
        RuleFor(r => r.AreInoculationsUpToDate).NotNull();
        RuleFor(r => r.TrainingInfo).NotEmpty();
        RuleFor(r => r.TrainingInfo)
            .SetValidator(new TrainingInfoValidator())
            .When(r => r.TrainingInfo != null);
    }
}

public class MailingAddressValidator : AbstractValidator<MailingAddress>
{
    public MailingAddressValidator()
    {
        RuleFor(r => r.Province).NotEmpty().MaximumLength(100);
        RuleFor(r => r.City).NotEmpty().MaximumLength(100);
        RuleFor(r => r.AddressLine1).NotEmpty().MaximumLength(100);
        RuleFor(r => r.Country).NotEmpty().MaximumLength(100);
        RuleFor(r => r.PostalCode).NotEmpty().MaximumLength(20);
    }
}

public class GraduationInfoValidator : AbstractValidator<GraduationInfo>
{
    public GraduationInfoValidator()
    {
        RuleFor(x => x.AccreditedSchoolId).NotEmpty().NotEqual(Guid.Empty);
        RuleFor(x => x.AccreditedSchoolName).MaximumLength(250);
        RuleFor(r => r.SchoolContactSurname).MaximumLength(40);
        RuleFor(r => r.SchoolContactGivenName).MaximumLength(40);
        RuleFor(r => r.SchoolContactEmailAddress).MaximumLength(75)
            .EmailAddress()
            .When(r => r.SchoolContactEmailAddress != null);
        RuleFor(r => r.SchoolContactPhoneNumber).MaximumLength(30);
    }
}

public class TrainingInfoValidator : AbstractValidator<TrainingInfo>
{
    public TrainingInfoValidator()
    {
        RuleFor(r => r.SchoolTrainings).NotNull().NotEmpty()
       .ForEach(child =>
       {
           child.SetValidator(new TrainingSchoolInfoValidator());
       })
       .When(r => r.HasAttendedTrainingSchool != null && r.HasAttendedTrainingSchool.Value);

        RuleFor(r => r.OtherTrainings).NotNull().NotEmpty()
        .ForEach(child =>
        {
            child.SetValidator(new OtherTrainingValidator());
        })
        .When(r => r.HasAttendedTrainingSchool != null && !r.HasAttendedTrainingSchool.Value);

        RuleFor(r => r.SpecializedTasksWhenPerformed).MaximumLength(1000);  //tbd if only 1 big block, then needs to be much larger
    }
}

public class TrainingSchoolInfoValidator : AbstractValidator<TrainingSchoolInfo>
{
    public TrainingSchoolInfoValidator()
    {
        RuleFor(x => x.TrainingBizName).MaximumLength(500);
        RuleFor(r => r.TrainingBizMailingAddress)
            .SetValidator(new MailingAddressValidator())
            .When(r => r.TrainingBizMailingAddress != null);
        RuleFor(r => r.ContactGivenName).MaximumLength(40);
        RuleFor(r => r.ContactSurname).MaximumLength(40);
        RuleFor(r => r.ContactEmailAddress).MaximumLength(75).EmailAddress().When(r => r.ContactEmailAddress != null);
        RuleFor(r => r.ContactPhoneNumber).MaximumLength(30);
        RuleFor(r => r.TrainingStartDate).Must(d => d > new DateOnly(1800, 1, 1)).When(r => r.TrainingStartDate != null);
        RuleFor(r => r.TrainingEndDate).Must(d => d > new DateOnly(1800, 1, 1)).When(r => r.TrainingEndDate != null);
        RuleFor(r => r).Must(d => d.TrainingEndDate >= d.TrainingStartDate).When(r => r.TrainingEndDate != null && r.TrainingStartDate != null);
        RuleFor(r => r.TrainingName).MaximumLength(100);
        RuleFor(r => r.WhatLearned).MaximumLength(1000);
    }
}

public class OtherTrainingValidator : AbstractValidator<OtherTraining>
{
    public OtherTrainingValidator()
    {
        RuleFor(r => r.TrainingDetail).MaximumLength(1000);
        RuleFor(r => r.DogTrainerCredential).MaximumLength(100);
        RuleFor(r => r.TrainingTime).MaximumLength(15);
        RuleFor(r => r.TrainerGivenName).MaximumLength(40);
        RuleFor(r => r.TrainerSurname).MaximumLength(40);
        RuleFor(r => r.TrainerEmailAddress).MaximumLength(75).EmailAddress().When(r => r.TrainerEmailAddress != null);
        RuleFor(r => r.TrainerPhoneNumber).MaximumLength(30);
        RuleFor(r => r.HoursPracticingSkill).MaximumLength(100);
    }
}

