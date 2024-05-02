using FluentValidation;

namespace Spd.Manager.Licence;
public class BizProfileUpdateRequestValidator : AbstractValidator<BizProfileUpdateRequest>
{
    public BizProfileUpdateRequestValidator()
    {
        RuleFor(r => r.BizId).NotEmpty();
        RuleFor(r => r.BizTypeCode).NotEmpty().IsInEnum();
        RuleFor(r => r.BizBCAddress).NotEmpty();
        RuleFor(r => r.BizMailingAddress)
            .NotEmpty()
            .When(r => r.MailingAddressIsSameBizAddress == false);
    }
}
