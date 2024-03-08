using FluentValidation;

namespace Spd.Manager.Licence;
public class ApplicantUpdateRequestValidator : AbstractValidator<ApplicantUpdateRequest>
{
    public ApplicantUpdateRequestValidator()
    {
        RuleFor(r => r.GivenName).NotEmpty();
        RuleFor(r => r.Surname).NotEmpty();
        RuleFor(r => r.DateOfBirth).NotEmpty();
        RuleFor(r => r.GenderCode).NotEmpty().IsInEnum();
        RuleFor(r => r.PhoneNumber).MaximumLength(15).NotEmpty();
        RuleFor(r => r.EmailAddress).MaximumLength(75).NotEmpty().EmailAddress();
        RuleFor(r => r.DocumentKeyCodes)
            .NotEmpty()
            .When(r => r.IsTreatedForMHC == true || r.IsPoliceOrPeaceOfficer == true);
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
        RuleFor(r => r.HasCriminalHistory).NotEmpty();
        RuleFor(r => r.IsPoliceOrPeaceOfficer).NotEmpty();
        RuleFor(r => r.IsTreatedForMHC).NotEmpty();
        RuleFor(r => r.HasNewMentalHealthCondition).NotNull();
        RuleFor(r => r.CriminalChargeDescription)
            .NotEmpty()
            .MaximumLength(1000)
            .When(r => r.HasNewCriminalRecordCharge == true);
    }
}