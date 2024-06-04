using FluentValidation;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public class PersonalLicenceAppBaseValidator<T> : AbstractValidator<T> where T : PersonalLicenceAppBase
{
    public PersonalLicenceAppBaseValidator()
    {
        RuleFor(r => r.WorkerLicenceTypeCode).NotEmpty();
        RuleFor(r => r.ApplicationTypeCode).NotEmpty();
        RuleFor(r => r.Surname).NotEmpty();
        RuleFor(r => r.DateOfBirth).NotEmpty();
        RuleFor(r => r.GenderCode).NotEmpty();
        RuleFor(r => r.LicenceTermCode).NotEmpty();
        RuleFor(r => r.HasExpiredLicence).NotEmpty();
        RuleFor(r => r.ExpiredLicenceId).NotEmpty().When(r => r.HasExpiredLicence == true);
        RuleFor(r => r.HasCriminalHistory).NotEmpty();
        RuleFor(r => r.HasBcDriversLicence).NotEmpty();
        RuleFor(r => r.HairColourCode).NotEmpty();
        RuleFor(r => r.EyeColourCode).NotEmpty();
        RuleFor(r => r.Height).NotEmpty();
        RuleFor(r => r.HeightUnitCode).NotEmpty();
        RuleFor(r => r.Weight).NotEmpty();
        RuleFor(r => r.WeightUnitCode).NotEmpty();
        RuleFor(r => r.IsMailingTheSameAsResidential).NotEmpty();
        RuleFor(r => r.PhoneNumber).MaximumLength(15).NotEmpty();
        RuleFor(r => r.EmailAddress).MaximumLength(75).When(r => r.EmailAddress != null);
        RuleFor(r => r.IsCanadianCitizen).NotEmpty();
        //residential address
        RuleFor(r => r.ResidentialAddress).NotEmpty().WithMessage("ResidentialAddress cannot be empty");
        RuleFor(r => r.ResidentialAddress.Province).NotEmpty().When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.City).NotEmpty().MaximumLength(100).When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.AddressLine1).NotEmpty().MaximumLength(100).When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.Country).NotEmpty().MaximumLength(100).When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.PostalCode).NotEmpty().MaximumLength(20).When(r => r.ResidentialAddress != null);
        RuleFor(r => r.HasNewCriminalRecordCharge).NotNull()
            .When(r => r.ApplicationTypeCode == ApplicationTypeCode.Renewal || r.ApplicationTypeCode == ApplicationTypeCode.Update);
    }
}




