using FluentValidation;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public class ApplicantUpdateRequestValidator : AbstractValidator<ApplicantUpdateRequest>
{
    public ApplicantUpdateRequestValidator()
    {
        RuleFor(r => r.ApplicationTypeCode).NotEmpty().IsInEnum().When(r => r.LicenceId != null);
        RuleFor(r => r.GivenName).NotEmpty();
        RuleFor(r => r.Surname).NotEmpty();
        RuleFor(r => r.DateOfBirth).NotEmpty();
        RuleFor(r => r.GenderCode).NotEmpty().IsInEnum();
        RuleFor(r => r.PhoneNumber).MaximumLength(30).NotEmpty();
        RuleFor(r => r.EmailAddress).MaximumLength(75).NotEmpty().EmailAddress();
        RuleFor(r => r.MailingAddress.AddressLine1)
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.MailingAddress != null);
        RuleFor(r => r.MailingAddress.City).NotEmpty()
            .MaximumLength(100)
            .When(r => r.MailingAddress != null);
        RuleFor(r => r.MailingAddress.Province).NotEmpty()
            .MaximumLength(100)
            .When(r => r.MailingAddress != null);
        RuleFor(r => r.MailingAddress.Country).NotEmpty()
            .MaximumLength(100)
            .When(r => r.MailingAddress != null);
        RuleFor(r => r.MailingAddress.PostalCode).NotEmpty()
            .MaximumLength(20)
            .When(r => r.MailingAddress != null);
        RuleFor(r => r.ResidentialAddress.AddressLine1)
            .NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.City).NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.Province).NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.Country).NotEmpty()
            .MaximumLength(100)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.ResidentialAddress.PostalCode).NotEmpty()
            .MaximumLength(20)
            .When(r => r.ResidentialAddress != null);
        RuleFor(r => r.HasCriminalHistory).NotNull().When(r => r.LicenceId != null);
        RuleFor(r => r.IsPoliceOrPeaceOfficer).NotNull().When(r => r.LicenceId != null);
        RuleFor(r => r.IsTreatedForMHC).NotNull().When(r => r.LicenceId != null);
        RuleFor(r => r.HasNewMentalHealthCondition).NotNull()
            .When(r => r.LicenceId != null &&
            (r.ApplicationTypeCode == ApplicationTypeCode.Renewal || r.ApplicationTypeCode == ApplicationTypeCode.Update));
        RuleFor(r => r.HasNewCriminalRecordCharge).NotNull()
            .When(r => r.LicenceId != null &&
            (r.ApplicationTypeCode == ApplicationTypeCode.Renewal || r.ApplicationTypeCode == ApplicationTypeCode.Update));
        RuleFor(r => r.CriminalChargeDescription)
            .NotEmpty()
            .MaximumLength(1000)
            .When(r => r.HasNewCriminalRecordCharge == true && r.LicenceId != null &&
            (r.ApplicationTypeCode == ApplicationTypeCode.Renewal || r.ApplicationTypeCode == ApplicationTypeCode.Update));
        RuleFor(r => r.Aliases)
            .Must(r => r.Count() <= Constants.MaximumNumberOfUserEnteredAliases)
            .When(r => r.Aliases != null)
            .WithMessage("No more than 10 user entered aliases are allowed");
    }
}