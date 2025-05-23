using FluentValidation;

namespace Spd.Manager.Licence;
public class BizProfileUpdateRequestValidator : AbstractValidator<BizProfileUpdateRequest>
{
    public BizProfileUpdateRequestValidator()
    {
        RuleFor(r => r.BizTradeName).NotEmpty();
        RuleFor(r => r.BizTypeCode).NotEmpty().IsInEnum();
        RuleFor(r => r.BizAddress).NotEmpty();
        RuleFor(r => r.BizBCAddress)
            .NotEmpty()
            .When(r => r.BizAddress?.Province != "BC" && r.BizAddress?.Province != "British Columbia");
        //RuleFor(r => r.SoleProprietorSwlEmailAddress)
        //    .NotEmpty()
        //    .EmailAddress()
        //    .When(r => r.BizTypeCode == BizTypeCode.NonRegisteredSoleProprietor || r.BizTypeCode == BizTypeCode.RegisteredSoleProprietor);
        //RuleFor(r => r.SoleProprietorSwlPhoneNumber)
        //    .NotEmpty()
        //    .MaximumLength(30)
        //    .When(r => r.BizTypeCode == BizTypeCode.NonRegisteredSoleProprietor || r.BizTypeCode == BizTypeCode.RegisteredSoleProprietor);
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
            .When(r => r.Branches != null &&
                 r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor &&
                 r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor);
        RuleFor(r => r.BizManagerContactInfo)
            .NotEmpty()
            .When(r => r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor && r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor);
        RuleFor(r => r.BizManagerContactInfo)
            .Must(r =>
                !string.IsNullOrEmpty(r.Surname) &&
                !string.IsNullOrEmpty(r.PhoneNumber) &&
                !string.IsNullOrEmpty(r.EmailAddress))
            .When(r => r.BizManagerContactInfo != null && r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor && r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor);
        RuleFor(r => r.BizManagerContactInfo.EmailAddress)
            .EmailAddress()
            .When(r => r.BizManagerContactInfo != null && r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor && r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor);
    }
}
