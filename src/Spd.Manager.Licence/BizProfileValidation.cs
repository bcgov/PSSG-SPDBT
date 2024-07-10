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
            .When(r => r.BizAddress.Province != "BC");
        RuleFor(r => r.SoleProprietorLicenceId)
            .NotEmpty()
            .When(r => r.BizTypeCode == BizTypeCode.NonRegisteredSoleProprietor || r.BizTypeCode == BizTypeCode.RegisteredSoleProprietor);
        RuleFor(r => r.SoleProprietorSwlEmailAddress)
            .NotEmpty()
            .When(r => r.BizTypeCode == BizTypeCode.NonRegisteredSoleProprietor || r.BizTypeCode == BizTypeCode.RegisteredSoleProprietor);
        RuleFor(r => r.SoleProprietorSwlPhoneNumber)
            .NotEmpty()
            .When(r => r.BizTypeCode == BizTypeCode.NonRegisteredSoleProprietor || r.BizTypeCode == BizTypeCode.RegisteredSoleProprietor);
        RuleFor(r => r.Branches)
            .ForEach(r => r
                .Must(r => !string.IsNullOrEmpty(r.BranchAddress?.AddressLine1))
                .Must(r => !string.IsNullOrEmpty(r.BranchAddress?.City))
                .Must(r => !string.IsNullOrEmpty(r.BranchAddress?.Country))
                .Must(r => !string.IsNullOrEmpty(r.BranchAddress?.Province))
                .Must(r => !string.IsNullOrEmpty(r.BranchAddress?.PostalCode))
                .Must(r => !string.IsNullOrEmpty(r.BranchManager)))
                .WithMessage("Missing branch address information.")
            .When(r => r.Branches != null &&
                 r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor &&
                 r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor);
        RuleFor(r => r.BizManagerContactInfo).NotEmpty();
    }
}
