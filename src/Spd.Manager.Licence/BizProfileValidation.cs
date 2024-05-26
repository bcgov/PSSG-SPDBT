using FluentValidation;

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
        //todo: add rule for branches
    }
}
