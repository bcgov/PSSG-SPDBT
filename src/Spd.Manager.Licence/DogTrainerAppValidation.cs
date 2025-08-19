using FluentValidation;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public class DogTrainerRequestValidator : AbstractValidator<DogTrainerRequest>
{
    public DogTrainerRequestValidator()
    {
        RuleFor(r => r.AccreditedSchoolId).NotEmpty().NotEqual(Guid.Empty)
            .When(r => r.ApplicationTypeCode != ApplicationTypeCode.Replacement);
        RuleFor(r => r.ServiceTypeCode).Must(t => t == ServiceTypeCode.DogTrainerCertification); //must be team, dog trainer or retired dog
        RuleFor(r => r.ApplicationTypeCode).NotEmpty();
        RuleFor(x => x.AccreditedSchoolName).NotEmpty().MaximumLength(250)
            .When(r => r.ApplicationTypeCode != ApplicationTypeCode.Replacement);
        RuleFor(r => r.SchoolContactEmailAddress).MaximumLength(75)
            .EmailAddress()
            .When(r => r.SchoolContactEmailAddress != null)
            .When(r => r.ApplicationTypeCode != ApplicationTypeCode.Replacement);
        RuleFor(r => r.SchoolContactPhoneNumber).MaximumLength(30);
        RuleFor(r => r.SchoolDirectorGivenName).MaximumLength(40);
        RuleFor(r => r.SchoolDirectorSurname).MaximumLength(40).NotEmpty().When(r => r.ApplicationTypeCode != ApplicationTypeCode.Replacement);
        RuleFor(r => r.SchoolDirectorMiddleName).MaximumLength(40);
        RuleFor(r => r.TrainerGivenName).MaximumLength(40);
        RuleFor(r => r.TrainerSurname).MaximumLength(40).NotEmpty();
        RuleFor(r => r.TrainerMiddleName).MaximumLength(40);
        RuleFor(r => r.TrainerMailingAddress).SetValidator(new MailingAddressValidator())
            .When(r => r.TrainerMailingAddress != null);
        RuleFor(r => r.TrainerDateOfBirth).NotNull().NotEmpty().Must(d => d > new DateOnly(1800, 1, 1));
        RuleFor(r => r.TrainerPhoneNumber).MaximumLength(30);
        RuleFor(r => r.TrainerEmailAddress).EmailAddress().MaximumLength(75).When(r => r.TrainerEmailAddress != null);
    }
}

public class DogTrainerChangeRequestValidator : AbstractValidator<DogTrainerChangeRequest>
{
    public DogTrainerChangeRequestValidator()
    {
        Include(new DogTrainerRequestValidator());
        RuleFor(r => r.OriginalLicenceId).NotEmpty();
        RuleFor(r => r.ApplicantId).NotEqual(Guid.Empty).NotEmpty();
    }
}