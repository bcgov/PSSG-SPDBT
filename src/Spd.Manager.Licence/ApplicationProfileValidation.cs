using FluentValidation;

namespace Spd.Manager.Licence;
public class ApplicantUpdateRequestValidator : AbstractValidator<ApplicantUpdateRequest>
{
    public ApplicantUpdateRequestValidator()
    {
        RuleFor(r => r.FirstName).NotEmpty();
        RuleFor(r => r.LastName).NotEmpty();
        RuleFor(r => r.BirthDate).NotEmpty();
        RuleFor(r => r.Gender).IsInEnum();
        RuleFor(r => r.PhoneNumber).MaximumLength(15).NotEmpty();
        RuleFor(r => r.EmailAddress).MaximumLength(75).NotEmpty();
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
        RuleFor(r => r.HasCriminalHistory).NotEmpty();
        RuleFor(r => r.CriminalChargeDescription)
            .NotEmpty()
            .MaximumLength(1000)
            .When(r => r.HasCriminalHistory == true);
        RuleFor(r => r.IsPoliceOrPeaceOfficer).NotEmpty();
        RuleFor(r => r.IsTreatedForMHC).NotEmpty();
    }
}