using FluentValidation;

namespace Spd.Manager.Licence;

public class MDRARegistrationValidator : AbstractValidator<MDRARegistrationRequest>
{
    public MDRARegistrationValidator()
    {
        RuleFor(x => x.BizOwnerSurname).NotEmpty().MaximumLength(40);
        RuleFor(r => r.BizLegalName).MaximumLength(160);
        RuleFor(r => r.BizTradeName).MaximumLength(160);
        RuleFor(r => r.BizEmailAddress).EmailAddress();
        RuleFor(r => r.BizManagerEmailAddress).EmailAddress();
        RuleFor(x => x.BizManagerFullName).NotEmpty().MaximumLength(40);
        RuleFor(r => r.BizAddress).SetValidator(new AddressValidator());
        RuleFor(r => r.BizMailingAddress).SetValidator(new AddressValidator());
        RuleFor(r => r.Branches)
            .ForEach(r => r
                .Must(r => !string.IsNullOrEmpty(r.BranchAddress?.AddressLine1))
                .Must(r => !string.IsNullOrEmpty(r.BranchAddress?.City))
                .Must(r => !string.IsNullOrEmpty(r.BranchAddress?.Country))
                .Must(r => !string.IsNullOrEmpty(r.BranchAddress?.Province))
                .Must(r => !string.IsNullOrEmpty(r.BranchAddress?.PostalCode))
                .Must(r => !string.IsNullOrEmpty(r.BranchManager))
                .Must(r => r.BranchPhoneNumber == null || r.BranchPhoneNumber?.Length <= 15))
                .WithMessage("Missing branch address information.")
            .When(r => r.Branches != null);
    }
}

public class AddressValidator : AbstractValidator<Address>
{
    public AddressValidator()
    {
        RuleFor(r => r.Province).NotEmpty().MaximumLength(100);
        RuleFor(r => r.City).NotEmpty().MaximumLength(100);
        RuleFor(r => r.AddressLine1).NotEmpty().MaximumLength(100);
        RuleFor(r => r.Country).NotEmpty().MaximumLength(100);
        RuleFor(r => r.PostalCode).NotEmpty().MaximumLength(20);
    }
}



