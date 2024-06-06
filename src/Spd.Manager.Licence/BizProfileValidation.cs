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
        //todo: add rule for branches
    }
}
