using FluentValidation;

namespace Spd.Manager.Licence;
public class ApplicantUpdateRequestValidator<T> : AbstractValidator<T> where T : ApplicantUpdateRequest
{
    public ApplicantUpdateRequestValidator() : base()
    {
        RuleFor(r => r.Gender).NotEmpty();
        RuleFor(r => r.ContactPhoneNumber).MaximumLength(15).NotEmpty();
        RuleFor(r => r.ContactEmailAddress).MaximumLength(75).When(r => r.ContactEmailAddress != null);
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