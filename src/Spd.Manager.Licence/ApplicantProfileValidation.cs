﻿using FluentValidation;

namespace Spd.Manager.Licence;
public class ApplicantUpdateRequestValidator : AbstractValidator<ApplicantUpdateRequest>
{
    public ApplicantUpdateRequestValidator()
    {
        RuleFor(r => r.Surname).NotEmpty();
        RuleFor(r => r.DateOfBirth).NotNull().NotEmpty().Must(d => d > new DateOnly(1800, 1, 1));
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
        RuleFor(r => r.Aliases)
            .Must(r => r.Count() <= Constants.MaximumNumberOfUserEnteredAliases)
            .When(r => r.Aliases != null)
            .WithMessage("No more than 10 user entered aliases are allowed");
    }
}