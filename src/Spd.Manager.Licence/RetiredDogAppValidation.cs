using FluentValidation;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public class RetiredDogLicenceAppUpsertRequestValidator : RetiredDogLicenceAppNewValidator<RetiredDogLicenceAppUpsertRequest>
{
    public RetiredDogLicenceAppUpsertRequestValidator()
    {
        RuleFor(r => r.ApplicantId).NotEmpty();
    }
}

public class RetiredDogLicenceAppAnonymousSubmitRequestValidator : RetiredDogLicenceAppBaseValidator<RetiredDogLicenceAppAnonymousSubmitRequest>
{
}

public class RetiredDogLicenceAppChangeRequestValidator : RetiredDogLicenceAppBaseValidator<RetiredDogLicenceAppChangeRequest>
{
    public RetiredDogLicenceAppChangeRequestValidator()
    {
        RuleFor(r => r.ApplicantId).NotEmpty();
        RuleFor(r => r.OriginalLicenceId).NotEmpty();
        RuleFor(r => r.DogId).NotEmpty();
    }
}

public class RetiredDogLicenceAppBaseValidator<T> : AbstractValidator<T> where T : RetiredDogLicenceAppBase
{
    public RetiredDogLicenceAppBaseValidator()
    {
        RuleFor(r => r.ServiceTypeCode).Must(t => t == ServiceTypeCode.RetiredServiceDogCertification); //must be team, dog trainer or retired dog
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

public class RetiredDogLicenceAppNewValidator<T> : AbstractValidator<T> where T : RetiredDogLicenceAppNew
{
    public RetiredDogLicenceAppNewValidator()
    {
        Include(new RetiredDogLicenceAppBaseValidator<T>());
    }
}




