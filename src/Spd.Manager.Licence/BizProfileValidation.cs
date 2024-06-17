using FluentValidation;
using Microsoft.IdentityModel.Tokens;

namespace Spd.Manager.Licence;
public class BizProfileUpdateRequestValidator : AbstractValidator<BizProfileUpdateRequest>
{
    public BizProfileUpdateRequestValidator()
    {
        RuleFor(r => r.BizTradeName).NotEmpty();
        RuleFor(r => r.BizTypeCode).NotEmpty().IsInEnum();
        RuleFor(r => r.BizAddress).NotEmpty();
        RuleFor(r => r.BizMailingAddress).NotEmpty();
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
                .Must(r => r.BranchAddress?.AddressLine1.IsNullOrEmpty() != true)
                .Must(r => r.BranchAddress?.City.IsNullOrEmpty() != true)
                .Must(r => r.BranchAddress?.Country.IsNullOrEmpty() != true)
                .Must(r => r.BranchAddress?.Province.IsNullOrEmpty() != true)
                .Must(r => r.BranchAddress?.PostalCode.IsNullOrEmpty() != true)
                .Must(r => r.BranchManager.IsNullOrEmpty() != true))
                .WithMessage("Missing branch address information.")
            .When(r => r.Branches != null &&
                 r.BizTypeCode != BizTypeCode.NonRegisteredSoleProprietor &&
                 r.BizTypeCode != BizTypeCode.RegisteredSoleProprietor);
    }
}
